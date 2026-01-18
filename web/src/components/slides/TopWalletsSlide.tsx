import { fmtNumber } from "../../utils/format";

type WalletEntry = {
  address: string;
  volumeUsd: number;
};

const wallets: WalletEntry[] = [
  { address: "0x2eeF6a6baC8254454485D6F8917478eF7653c38B", volumeUsd: 3145782 },
  { address: "0x333Afd65D93A95eE6e66415C07785B2E341Bff2d", volumeUsd: 3105885 },
  { address: "0xEbb8612C859e2C468aB3A0c60C59692eC7B51FB0", volumeUsd: 1941059 },
  { address: "0x0D839361F53859572642266C2a90584c083213F4", volumeUsd: 1779613 },
  { address: "0xAbd929adC7199a9233af6787445e9e5a47FF0c15", volumeUsd: 1006048 },
];

const shortenAddress = (address: string) => {
  if (!address) return "Unknown";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

const formatUsd = (value: number) => {
  const formatted = fmtNumber(value, "—");
  return formatted === "—" ? formatted : `$${formatted}`;
};

export default function TopWalletsSlide() {
  const sorted = [...wallets].sort((a, b) => b.volumeUsd - a.volumeUsd);

  return (
    <div className="story-card">
      <div className="story-kicker">Who Drove the Activity?</div>
      <h2 className="story-title">A small group did most of the work</h2>
      <p className="story-subtitle">Season 2 data reveals a familiar pattern.</p>
      <p className="story-subtitle">
        A relatively small group of wallets accounted for a large share of points
        accumulation and trading volume.
      </p>
      <p className="story-subtitle">
        While profitability data isn’t public, this competitive dynamic tells us
        one thing clearly: leaderboards created real competition.
      </p>
      <div className="story-list">
        {sorted.map((wallet, index) => (
          <div key={wallet.address} className="story-row">
            <span>
              {index + 1}. {shortenAddress(wallet.address)}
            </span>
            <strong>{formatUsd(wallet.volumeUsd)}</strong>
          </div>
        ))}
      </div>
      <p className="story-footnote">
        Ranked by observed volume and points, not profitability.
      </p>
    </div>
  );
}
