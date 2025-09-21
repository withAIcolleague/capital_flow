아래는 “전 세계 자금 흐름 모니터링 웹페이지”를 만들기 위한 \*\*마크다운 사양서(README 초안)\*\*입니다. 이 문서만으로 코딩 어시스턴트와 바로 개발을 시작할 수 있게 **데이터 소스, 스키마, ETL 파이프라인, 프론트엔드 컴포넌트, 배치 스케줄, 지표 정의**를 모두 담았습니다. (핵심 수치/출처는 각 절에 인용)

---

# Global Capital Flow Monitor — Spec (KR)

## 0) 목표

* **무엇**: 자산 분야별(부동산·채권·주식·현금·원자재·FDI 등) 규모와 **자금 유입/유출(+/–)**, 그리고 **분야 간 이동**을 한 화면에서 모니터링
* **왜**: “돈이 어디서 나와 어디로 들어가는가?”를 **공식·반(民間) 공식 데이터**를 조합해 방향성으로 파악
* **어떻게**: 공개/상업 데이터의 **갱신 주기**를 존중하며, 실시간은 **펀드 플로우·시장 데이터**, 분기/연간은 **부동산·FDI·BIS**로 보완

---

## 1) 핵심 지표 정의

### 1.1 자산 분야별 “규모(Level)”

* **부동산(Residential/Total Property)**: 예) 2024년 말 글로벌 주거용 부동산 **\$286.9T** (Savills). 장기 시계열은 2022년 총 부동산 **\$379.7T** 참고. ([Savills Impacts][1])
* **채권(고정수입/총 발행잔액)**: 2024년 **\$145.1T** (SIFMA Fact Book). ([SIFMA][2])
* **주식(전세계 시가총액)**: 2024년 **\$126.7T** (SIFMA). WFE 월별 통계로 보완. ([SIFMA][2])
* **현금/머니마켓(대리지표)**: 머니마켓펀드(MMF) 유입·유출(EPFR, iMoneyNet 개요). ([epfr.com][3])
* **원자재/금(대리지표)**: 금 ETF 플로우(주간/월간), 주요 원자재 지수 수준
* **국제자본/FDI**: UNCTAD World Investment Report(연간). ([UN Trade and Development (UNCTAD)][4])
* **국채/글로벌 발행·잔액 상세**: BIS Debt Securities Statistics. ([국제결제은행][5])
* **대외증권 보유/TIC**: 미 재무부 TIC(월간/연간). ([U.S. Department of the Treasury][6])
* **거시 유동성(M2 등)**: IMF Data/FRED(국가별). ([IMF][7])
* **글로벌 총부채(IIF)**: 헤드라인 추세 참고. ([Reuters][8])

> ⚠️ 주의: 자산 “총량”은 기관·범위·방법론 차이로 수치 편차가 있으므로, **출처·시점·정의**를 카드/툴팁에 병기.

### 1.2 “흐름(Flow, +/–)” 정의

* **펀드 플로우(주간/월간)**: EPFR(상업 데이터) 또는 대체로이터 헤드라인 요약, 자산군/지역/섹터별 **순유입/순유출**. ([epfr.com][9])
* **채권 발행/만기/순증감**: BIS/SIFMA의 **발행·상환**로 순증감 추정. ([BIS 데이터 포털][10])
* **FDI 순유입/유출(연간)**: UNCTAD. ([UN Trade and Development (UNCTAD)][4])
* **TIC 순변화(월간)**: 외국인의 미 국채·주식 보유 증감. ([U.S. Department of the Treasury][6])
* **머니마켓/현금 포지션 변화**: MMF 플로우. ([epfr.com][3])

---

## 2) 시스템 아키텍처

```
[ETL Jobs (Python)]
  ├─ Source Adapters
  │   ├─ Savills (부동산 총량/연도)
  │   ├─ SIFMA (채권/주식 총량/연도, CSV/PDF 파싱)
  │   ├─ BIS (Debt Securities CSV/API)
  │   ├─ UNCTAD (FDI 연간 PDF/CSV)
  │   ├─ TIC (미 재무부, CSV)
  │   ├─ EPFR (주간 플로우, 상업 API)
  │   └─ WFE (월간 시총)
  ├─ Normalizer (통화/단위/시점 정규화, USD 기준)
  ├─ Aggregator (자산군 분류, 최신값/전기대비/전년대비)
  └─ Warehouse (PostgreSQL)
        ├─ fact_levels, fact_flows
        ├─ dim_assets, dim_regions, dim_sources
        └─ materialized views (for dashboard)

[API (FastAPI/Node)]
  ├─ /levels?as_of=2024-12-31
  ├─ /flows?freq=weekly&asset_class=equity
  ├─ /heatmap?window=13w
  └─ /notes/sources

[Frontend (Next.js + React + Recharts)]
  ├─ Overview (타일/카드: 각 자산군 규모, WoW/YoY)
  ├─ Flows (주간 플로우 +/– 막대)
  ├─ Cross-asset Heatmap (분야간 상대 강도)
  ├─ Drilldown (채권/주식/FDI 상세)
  └─ Source Inspector (출처/정의/Methodology)
```

---

## 3) 데이터 모델(스키마)

### 3.1 차원 테이블

* `dim_assets(asset_id, asset_class, sub_class, description)`

  * 예: (`EQUITY`,`Global`), (`BOND`,`Global`), (`REAL_ESTATE`,`Residential`), (`CASH`,`MMF`), (`COMMODITY`,`Gold`)
* `dim_regions(region_id, region, country_iso3)`
* `dim_sources(source_id, name, url, methodology_notes)`

### 3.2 사실 테이블

* `fact_levels(id, asset_id, as_of_date, value_usd_trn, source_id, revision_tag)`

  * 예: 2024-12-31, EQUITY(Global), **126.7** (USD T), SIFMA
* `fact_flows(id, asset_id, period_start, period_end, freq, flow_usd_bn, source_id, coverage_note)`

  * 예: 2025-09-12\~2025-09-19, EQUITY(Global), **–38.66** (USD B, Reuters/EPFR 주간) ([Reuters][11])
* `fact_meta(id, key, value)` (환율, 디플레이터, 주석)

### 3.3 머티리얼라이즈드 뷰

* `mv_latest_levels` (자산군별 최신 값/전기/전년 비교)
* `mv_flow_rolling` (4주/13주/26주 누적 플로우)
* `mv_cross_asset_score` (표준화된 z-score로 +/– 히트맵 계산)

---

## 4) ETL 파이프라인 설계

### 4.1 공통 규칙

* **통화**: USD 고정, 조 단위 표기(`*_usd_bn/trn`)
* **결측치**: 이전 값 보간 금지, “N/A”를 명시하고 UI에서 회색 처리
* **출처·정의**: 레코드마다 `source_id`, `methodology_notes` 필수

### 4.2 소스별 어댑터(요약)

* **Savills (부동산 총량)**: 연 1회 또는 보고서 갱신 시 PDF/HTML 파싱 → `fact_levels` 업데이트. ([Savills Impacts][1])
* **SIFMA (채권/주식 총량)**: 연 1회, Fact Book CSV/PDF 파싱. ([SIFMA][2])
* **BIS DSS (채권 세부)**: 분기/월간 CSV → 발행/상환/잔액. ([국제결제은행][5])
* **UNCTAD WIR (FDI)**: 연 1회 PDF/CSV → 지역·국가별 FDI 흐름. ([UN Trade and Development (UNCTAD)][4])
* **TIC (미 대외증권 보유)**: 월간 CSV → 외국인 미 국채/주식 보유 순변화. ([U.S. Department of the Treasury][6])
* **EPFR (펀드 플로우)**: 주간 API(상업) → 자산군/지역/섹터 플로우(+/–). ([epfr.com][9])
* **WFE (시총 월간)**: 지역/거래소별 시총 집계 보조. ([Focus World Exchanges][12])
* **IIF (글로벌 총부채)**: 분기 헤드라인 참고(카드 주석). ([Reuters][8])
* **IMF (거시/유동성)**: 국가별 M2/재정지표(옵션). ([IMF][7])
* **Reuters 헤드라인(대체)**: EPFR 요약치 공공 인용 시 주간 흐름 카드에 표시. ([Reuters][11])

### 4.3 ETL 예시(파이썬 의사코드)

```python
# /etl/run_all.py
from loaders import sifma, bis, savills, unctad, tic, epfr

def main():
    sifma.load_levels()     # equity/bond totals → fact_levels
    bis.load_debt()         # issuance/redemption/outstanding → fact_levels/flows
    savills.load_property() # property totals → fact_levels
    unctad.load_fdi()       # FDI flows → fact_flows
    tic.load_holdings()     # TIC monthly → fact_flows
    epfr.load_flows()       # weekly fund flows → fact_flows
    # then normalize & refresh MVs
    refresh_materialized_views()

if __name__ == "__main__":
    main()
```

```python
# /etl/utils/normalize.py
def to_usd(value, currency, date):
    # 환율 테이블로 USD 환산
    ...

def standardize_period(freq, start, end):
    # weekly/monthly/annual period normalization
    ...
```

---

## 5) 프론트엔드 설계 (Next.js + React + Recharts)

### 5.1 페이지

* **/ (Overview)**

  * **Top Tiles**: 자산군별 최신 **규모(Level)**, 전기/전년 **증감율**
  * **Weekly Net Flows Bar**: 주간 +/– (EQUITY, BOND, CASH, GOLD 등)
  * **Cross-Asset Heatmap**: 최근 13주 표준화 점수(+ 녹색, – 붉은색)
* **/flows**

  * **자산군/지역 필터**, 주간/월간 토글
  * 누적(4w/13w/26w) 라인차트
* **/assets/\[asset]**

  * 선택 자산군 상세(정의/출처/갱신주기/시계열)
* **/methodology**

  * **출처/정의/주의사항** 정리(“유입 중심 통계 착시” 등 설명)

### 5.2 컴포넌트

* `<KPIChip />`: 최신 값·전기/전년 증감
* `<FlowBar />`: 주간 +/– 막대
* `<Heatmap />`: z-score 맵
* `<SourceBadge />`: 출처 아이콘+툴팁(링크, 갱신일)

### 5.3 API 계약

* `GET /api/levels?as_of=YYYY-MM-DD` → `[ { asset_id, value_usd_trn, yoy, qoq, source } ]`
* `GET /api/flows?freq=weekly&window=13&asset=EQUITY` → 시계열
* `GET /api/heatmap?window=13` → { asset\_id: \[z1..z13] }

### 5.4 예시(프론트 코드 스니펫)

```tsx
// components/FlowBar.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FlowBar({ data }: { data: { week: string; flow_usd_bn: number }[] }) {
  return (
    <div className="rounded-2xl p-4 shadow">
      <div className="text-xl font-semibold mb-2">Weekly Net Flows (USD Bn)</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="flow_usd_bn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## 6) 계산 로직

### 6.1 +/– 규칙

* **Flow +/–**: 기간 내 순유입(+)·순유출(–) 그대로 사용 (EPFR/Reuters 주간) ([Reuters][11])
* **Cross-asset 점수**: 자산군별 주간 플로우를 **최근 52주 평균·표준편차**로 표준화한 z-score
* **규모 레벨 변화율**: `YoY = (현재 - 1년전) / 1년전`

### 6.2 분야 간 이동(Heuristic)

* **단기**: 같은 기간 `EQUITY_FLOW` 상승 & `CASH/MMF_FLOW` 하락 → “현금→주식” 가설
* **중기**: `BOND_ISSUANCE - REDEMPTION` 순증감과 `EQUITY_FLOW` 동시 변화 패턴
* **보수적 표기**: \*\*‘암시적 이동’\*\*으로 카드에 표기하고, 근거(동행지표) 툴팁 제공

---

## 7) 갱신 주기·스케줄러

| 소스               | 빈도   | 잡 스케줄          | 노트                                                   |
| ---------------- | ---- | -------------- | ---------------------------------------------------- |
| EPFR(주간 플로우)     | 주 1회 | 매주 금 09:00 KST | 상업 API/계약 필요 ([epfr.com][9])                         |
| Reuters 헤드라인(대체) | 주 1회 | 매주 금 09:30     | 요약치 카드(출처 표기) ([Reuters][11])                        |
| WFE(시총)          | 월 1회 | 매월 10일         | 월간 업데이트 ([Focus World Exchanges][12])                |
| BIS(DSS)         | 월/분기 | 매월 15일         | CSV 자동 수집 ([국제결제은행][5])                              |
| SIFMA(Fact Book) | 연 1회 | 7\~8월          | 연간 리프레시 ([SIFMA][2])                                 |
| Savills(부동산)     | 연 1회 | 1\~3분기         | 보고서 공개 시 갱신 ([Savills Impacts][1])                   |
| UNCTAD(FDI)      | 연 1회 | 6\~7월          | WIR 공개 시 반영 ([UN Trade and Development (UNCTAD)][4]) |
| TIC(미 대외보유)      | 월 1회 | 매월 16일         | CSV pull & 파싱 ([U.S. Department of the Treasury][6]) |
| IMF(M2/거시)       | 월/분기 | 매월 20일         | 국가별 최신치 스냅샷 ([IMF][7])                               |

**Cron 예시**
`0 0 * * 5 etl_epfr.sh` (매주 금 00:00 UTC = 금 09:00 KST)
`0 0 10 * * etl_wfe.sh` (매월 10일) 등

---

## 8) 품질/한계 안내(메서돌로지 페이지에 노출)

* **실시간 한계**: 부동산·FDI는 분기/연간 지표
* **유입 통계 착시**: 펀드 플로우는 **유출-유입 대칭**이 항상 명확히 잡히지 않음(부분집계) → **설명 배지** 제공
* **정의 차이**: “부동산 총액”은 범위/방법론에 따라 편차 → 출처/시점 병기
* **가설 표기**: 분야 간 이동은 **동행지표 기반 추론**임을 명시

---

## 9) 로컬 개발 & 배포

### 9.1 스택

* **Backend**: FastAPI(Python) 또는 Node/Express
* **DB**: PostgreSQL + Timescale(선택)
* **Frontend**: Next.js(앱 라우터), Recharts, Tailwind
* **Infra**: Docker Compose, GitHub Actions(CI), Cloud Run/Render/EC2

### 9.2 .env 예시

```
DB_URL=postgres://...
EPFR_API_KEY=...
BIS_BASE=https://data.bis.org/...
TIC_URL=https://home.treasury.gov/...
```

### 9.3 API 예시(FastAPI)

```python
from fastapi import FastAPI
from db import get_latest_levels, get_flows

app = FastAPI()

@app.get("/api/levels")
def levels(as_of: str | None = None):
    return get_latest_levels(as_of)

@app.get("/api/flows")
def flows(freq: str = "weekly", asset: str | None = None, window: int = 13):
    return get_flows(freq, asset, window)
```

---

## 10) 초기 Seed 데이터(카드 표기 예)

* **Equity (Global, 2024)**: **\$126.7T** (SIFMA) ([SIFMA][2])
* **Fixed Income Outstanding (2024)**: **\$145.1T** (SIFMA) ([SIFMA][2])
* **Residential Real Estate (2024)**: **\$286.9T** (Savills) ([Savills Impacts][1])
* **Weekly Equity Flow (2025-09-17 주간)**: **–\$38.66B** (Reuters 요약/EPFR) ([Reuters][11])

---

## 11) UX 디테일

* 각 카드에 **출처 배지**(툴팁: 정의/시점/링크)
* **색상 규칙**: Flow +는 ▲, –는 ▼ 아이콘 및 명도 차이
* **단위 토글**: `USD Bn / USD Trn` 전환
* **다운로드**: CSV Export(현재 뷰 필터 적용)

---

## 12) 향후 확장

* **국가/지역 탭**(미국/유럽/중국/한국)
* **섹터 플로우**(테크/에너지/헬스케어 등, EPFR 필요)
* **리스크 인덱스**(VIX, MOVE, TED, HY OAS 등)
* **정책 이벤트 타임라인**(금리 결정, QE/QT)

---

## 13) 라이선스/법적 고지

* 본 서비스는 **공개/상업 데이터**를 조합한 **정보 제공용**으로, **투자 자문**이 아님.
* 상업 데이터(EPFR 등)는 **별도 계약**이 필요하며, API 결과의 **2차 배포 제한**을 준수.

---

### 참고 출처(핵심)

* Savills — 글로벌 부동산 총액/주거용 가치(연간). ([Savills Impacts][1])
* SIFMA — 글로벌 채권·주식 총량/발행/통계. ([SIFMA][2])
* BIS DSS — 채권 발행/잔액 시계열 CSV. ([국제결제은행][5])
* UNCTAD WIR — FDI 흐름(연간). ([UN Trade and Development (UNCTAD)][4])
* TIC — 외국인 미 증권 보유(월간). ([U.S. Department of the Treasury][6])
* WFE — 전세계 시총 월간. ([Focus World Exchanges][12])
* EPFR — 글로벌 펀드 플로우(주간, 상업). ([epfr.com][9])
* IIF — 글로벌 총부채 헤드라인. ([Reuters][8])
* Reuters — 최신 주간 플로우 헤드라인 요약. ([Reuters][11])

---

이 문서를 `README.md`로 저장해 시작하시면 됩니다.
원하시면 **초기 Next.js 프로젝트 템플릿**과 **PostgreSQL DDL 스크립트**도 바로 만들어 드릴게요.

[1]: https://impacts.savills.com/market-trends/where-are-the-worlds-most-valuable-residential-markets.html?utm_source=chatgpt.com "Where are the world's most valuable residential markets?"
[2]: https://www.sifma.org/resources/research/statistics/fact-book/?utm_source=chatgpt.com "Capital Markets Fact Book - SIFMA"
[3]: https://epfr.com/solutions/fund-flows-and-allocations-data/?utm_source=chatgpt.com "Fund flows and asset allocations data"
[4]: https://unctad.org/publication/world-investment-report-2024?utm_source=chatgpt.com "World Investment Report 2024: Investment facilitation and ..."
[5]: https://www.bis.org/statistics/secstats_to180923.htm?utm_source=chatgpt.com "Debt securities statistics"
[6]: https://home.treasury.gov/data/treasury-international-capital-tic-system?utm_source=chatgpt.com "Treasury International Capital (TIC) System | U.S. ..."
[7]: https://www.imf.org/en/Data?utm_source=chatgpt.com "IMF Data"
[8]: https://www.reuters.com/world/china/global-debt-hits-record-over-324-trillion-says-iif-2025-05-06/?utm_source=chatgpt.com "Global debt hits record of over $324 trillion, banking trade group says"
[9]: https://epfr.com/?utm_source=chatgpt.com "EPFR | Fund Flows, Asset Allocations Data & Investment Insights"
[10]: https://data.bis.org/topics/DSS?utm_source=chatgpt.com "Debt securities statistics - overview | BIS Data Portal"
[11]: https://www.reuters.com/business/global-markets-flows-graphic-2025-09-19/?utm_source=chatgpt.com "Global equity funds see a surge in weekly outflows"
[12]: https://focus.world-exchanges.org/issue/june-2024/market-statistics?utm_source=chatgpt.com "Market Statistics - June 2024"


---

# 📌 비제도권 자금 (Non-Official / Shadow Capital)

## 1. **그림자 경제(Shadow Economy)**

* **규모**: 전 세계 GDP의 **10\~20%** (IMF, 세계은행, OECD 추정).
  → 약 **10\~20조 달러**.
* **내용**: 세금 회피 목적의 현금거래, 불법 노동, 밀수, 불법 서비스(도박·매춘·마약 등).
* **자금 이동 방향**

  * **현금 위주**: 은행시스템 바깥에서 거래.
  * **세탁(AML)**: 페이퍼컴퍼니·환치기·지하환전상을 통해 제도권으로 흡수되기도 함.
* **출처**: Schneider(오스트리아 경제학자)의 Shadow Economy Index, IMF Working Paper 시리즈.

---

## 2. **조세회피처·역외 자산 (Offshore Wealth)**

* **규모**: 전 세계 금융자산의 \*\*\~8\~10%\*\*가 조세회피처에 숨겨져 있음.
  → 약 **7\~10조 달러** (Gabriel Zucman, “Hidden Wealth of Nations”).
* **방식**:

  * 역외펀드(케이맨, 버진아일랜드, 룩셈부르크 등).
  * 신탁·유령회사·차명계좌.
* **자금 이동 방향**

  * **고소득층/기업 → Offshore** (세금 회피 목적).
  * 이후 **재투자 → 뉴욕/런던 금융시장, 부동산, 미술품**으로 환류.
* **출처**: Tax Justice Network, OECD BEPS 프로젝트, Zucman 연구.

---

## 3. **불법 금융 및 범죄 자금**

* **규모**: 유엔 UNODC 추정에 따르면,

  * **국제 범죄 수익** 약 연간 **8,700억\~2조 달러**.
  * **자금세탁(AML)** 총합은 전 세계 GDP의 **2\~5%** (약 2\~4조 달러).
* **분야**: 마약, 무기, 불법 광물, 사이버 범죄.
* **자금 이동 방향**

  * 현금 → 암호화폐·환치기 → 페이퍼컴퍼니 → 제도권 부동산·주식으로 세탁.
* **출처**: UNODC “Estimating Illicit Financial Flows”, FATF 보고서.

---

## 4. **현물 형태 자산**

1. **현금(M0, 지폐·동전)**

   * 전 세계 합계 약 **7\~8조 달러** 발행.
   * 이 중 일정 비율은 **탈세·뇌물·지하경제**에 사용.
2. **금(Gold)**

   * 약 **20만 톤** 매장/보유 → 시가 **15조 달러** 내외.
   * 중앙은행·ETF 보관분은 제도권, 개인 보관분은 비제도권 성격.
3. **은(Silver)**

   * 시가총액 수천억\~1조 달러 미만.
   * 산업용 비중이 커서 ‘저장수단’ 기능은 금보다 약함.
4. **귀중품(다이아몬드, 예술품, 와인, 골동품)**

   * 몇천억 달러 추정.
   * 탈세·자산 은닉 용도로 자주 사용됨.

---

## 5. **암호화폐 (Crypto Assets)**

* **규모**: 시가총액 약 **2\~3조 달러** (2025 기준).
* **특징**: 제도권 편입(ETF 승인, 규제 강화)과 비제도권 활용(익명성, 다크넷 거래)이 공존.
* **자금 이동 방향**

  * 합법적: 투자·결제·송금 → 점차 제도권 편입.
  * 불법적: 랜섬웨어·다크웹 결제 → 믹싱·프라이버시 코인 → 현금화.
* **출처**: Chainalysis “Crypto Crime Report”, BIS Quarterly Review.

---

# ✅ 종합

* **비제도권 자금 총합**: 약 **20\~30조 달러** 수준으로 추정.

  * 그림자 경제: 10\~20조
  * 조세회피처: 7\~10조
  * 불법 금융: 2\~4조
  * 금·현금·귀중품: 15\~20조 (단, 제도권/비제도권 경계 애매)
  * 암호화폐: 2\~3조
* **흐름 패턴**:

  * **그림자 경제/범죄 자금** → 현금·환치기 → 암호화폐 → 제도권 자산(부동산, 주식).
  * **부자·기업** → Offshore → 역외펀드 → 다시 주요 금융시장(뉴욕·런던·홍콩).
  * **현물 자산(금·예술품)** → 위기/제재 상황에서 “가치 은닉·탈출 자금”으로 이동.

---

👉 원하시면 제가 “📊 비제도권 자금 흐름 맵”을 단계별(자금 출처 → 이동 경로 → 최종 목적지)로 표로 정리해드릴까요?
