// WebSocket 서비스 타입 정의
export interface WebSocketMessage {
  type: 'price_update' | 'flow_update' | 'alert' | 'anomaly' | 'heartbeat';
  data: any;
  timestamp: number;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface FlowUpdate {
  asset: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  timestamp: number;
}

export interface AlertData {
  id: string;
  type: 'flow' | 'price' | 'anomaly' | 'threshold';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  asset?: string;
}

export interface AnomalyData {
  id: string;
  type: 'statistical' | 'pattern' | 'volume' | 'velocity' | 'behavioral';
  confidence: number;
  description: string;
  timestamp: number;
  affectedAssets: string[];
}

// WebSocket 서비스 클래스
export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // WebSocket 연결
  connect(url: string = 'wss://api.capitalflowmonitor.com/ws'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket 연결 성공');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('WebSocket 메시지 파싱 오류:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket 연결 종료:', event.code, event.reason);
          this.stopHeartbeat();
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket 오류:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // 메시지 처리
  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('WebSocket 리스너 오류:', error);
        }
      });
    }
  }

  // 리스너 등록
  subscribe(type: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // 구독 해제 함수 반환
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  // 메시지 전송
  send(type: string, data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: type as any,
        data,
        timestamp: Date.now()
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket이 연결되지 않았습니다.');
    }
  }

  // 하트비트 시작
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send('heartbeat', { timestamp: Date.now() });
    }, 30000); // 30초마다 하트비트
  }

  // 하트비트 중지
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // 재연결 처리
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`WebSocket 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectInterval);
    } else {
      console.error('WebSocket 최대 재연결 시도 횟수 초과');
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // 연결 종료
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  // 특정 자산 구독
  subscribeToAsset(asset: string): void {
    this.send('subscribe', { asset });
  }

  // 특정 자산 구독 해제
  unsubscribeFromAsset(asset: string): void {
    this.send('unsubscribe', { asset });
  }

  // 알림 설정
  setAlertThreshold(asset: string, threshold: number, type: 'price' | 'flow'): void {
    this.send('set_alert', { asset, threshold, type });
  }
}

// 싱글톤 인스턴스 내보내기
export const websocketService = WebSocketService.getInstance();
