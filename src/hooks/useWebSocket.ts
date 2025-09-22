import { useEffect, useRef, useState, useCallback } from 'react';
import { websocketService, WebSocketMessage, PriceUpdate, FlowUpdate, AlertData, AnomalyData } from '../services/websocketService';

// WebSocket 훅 옵션
interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
  heartbeatInterval?: number;
}

// WebSocket 훅 반환 타입
interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (type: string, data: any) => void;
  subscribe: (type: string, callback: (data: any) => void) => () => void;
  lastMessage: WebSocketMessage | null;
  priceUpdates: PriceUpdate[];
  flowUpdates: FlowUpdate[];
  alerts: AlertData[];
  anomalies: AnomalyData[];
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    reconnectOnMount = true,
    heartbeatInterval = 30000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [flowUpdates, setFlowUpdates] = useState<FlowUpdate[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);

  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // 연결 함수
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      await websocketService.connect();
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '연결 실패');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting]);

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setError(null);
  }, []);

  // 메시지 전송 함수
  const send = useCallback((type: string, data: any) => {
    websocketService.send(type, data);
  }, []);

  // 구독 함수
  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    const unsubscribe = websocketService.subscribe(type, callback);
    unsubscribeRefs.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  // 가격 업데이트 처리
  useEffect(() => {
    const unsubscribe = subscribe('price_update', (data: PriceUpdate) => {
      setPriceUpdates(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(item => item.symbol === data.symbol);
        
        if (existingIndex >= 0) {
          updated[existingIndex] = data;
        } else {
          updated.push(data);
        }
        
        // 최대 100개까지만 유지
        return updated.slice(-100);
      });
    });

    return unsubscribe;
  }, [subscribe]);

  // 플로우 업데이트 처리
  useEffect(() => {
    const unsubscribe = subscribe('flow_update', (data: FlowUpdate) => {
      setFlowUpdates(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(item => 
          item.asset === data.asset && item.timestamp === data.timestamp
        );
        
        if (existingIndex >= 0) {
          updated[existingIndex] = data;
        } else {
          updated.push(data);
        }
        
        // 최대 200개까지만 유지
        return updated.slice(-200);
      });
    });

    return unsubscribe;
  }, [subscribe]);

  // 알림 처리
  useEffect(() => {
    const unsubscribe = subscribe('alert', (data: AlertData) => {
      setAlerts(prev => {
        const updated = [...prev, data];
        // 최대 50개까지만 유지
        return updated.slice(-50);
      });
    });

    return unsubscribe;
  }, [subscribe]);

  // 이상 탐지 처리
  useEffect(() => {
    const unsubscribe = subscribe('anomaly', (data: AnomalyData) => {
      setAnomalies(prev => {
        const updated = [...prev, data];
        // 최대 30개까지만 유지
        return updated.slice(-30);
      });
    });

    return unsubscribe;
  }, [subscribe]);

  // 일반 메시지 처리
  useEffect(() => {
    const unsubscribe = subscribe('heartbeat', (data: any) => {
      setLastMessage({
        type: 'heartbeat',
        data,
        timestamp: Date.now()
      });
    });

    return unsubscribe;
  }, [subscribe]);

  // 자동 연결
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting) {
      connect();
    }
  }, [autoConnect, isConnected, isConnecting, connect]);

  // 마운트 시 재연결
  useEffect(() => {
    if (reconnectOnMount && !isConnected) {
      connect();
    }
  }, [reconnectOnMount, isConnected, connect]);

  // 연결 상태 모니터링
  useEffect(() => {
    const interval = setInterval(() => {
      const connected = websocketService.isConnected();
      if (connected !== isConnected) {
        setIsConnected(connected);
        if (connected) {
          setError(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe());
      unsubscribeRefs.current = [];
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    send,
    subscribe,
    lastMessage,
    priceUpdates,
    flowUpdates,
    alerts,
    anomalies
  };
}

// 특정 자산 구독 훅
export function useAssetSubscription(asset: string) {
  const { isConnected, send, subscribe } = useWebSocket();
  const [assetData, setAssetData] = useState<any>(null);

  useEffect(() => {
    if (isConnected && asset) {
      send('subscribe', { asset });
      
      const unsubscribe = subscribe('price_update', (data: PriceUpdate) => {
        if (data.symbol === asset) {
          setAssetData(data);
        }
      });

      return () => {
        unsubscribe();
        send('unsubscribe', { asset });
      };
    }
  }, [isConnected, asset, send, subscribe]);

  return assetData;
}

// 알림 구독 훅
export function useAlerts() {
  const { alerts, subscribe } = useWebSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe('alert', () => {
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [subscribe]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    alerts,
    unreadCount,
    markAsRead
  };
}
