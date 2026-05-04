import { NextApiRequest, NextApiResponse } from 'next';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [marketsRes, globalRes] = await Promise.all([
      fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,cardano,solana&order=market_cap_desc&sparkline=false`,
        { headers: { Accept: 'application/json' } }
      ),
      fetch(`${COINGECKO_BASE}/global`, {
        headers: { Accept: 'application/json' },
      }),
    ]);

    if (!marketsRes.ok || !globalRes.ok) {
      throw new Error('CoinGecko API error');
    }

    const markets = await marketsRes.json();
    const global = await globalRes.json();

    const coins = markets.map((c: any) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      price: c.current_price,
      marketCap: c.market_cap / 1e12,       // T 단위
      change24h: c.price_change_percentage_24h ?? 0,
      volume24h: c.total_volume / 1e9,       // B 단위
      lastUpdated: c.last_updated,
    }));

    const totalMarketCapT = (global.data?.total_market_cap?.usd ?? 0) / 1e12;
    const totalVolumeB = (global.data?.total_volume?.usd ?? 0) / 1e9;

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ coins, totalMarketCapT, totalVolumeB, fetchedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
}
