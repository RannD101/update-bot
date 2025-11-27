export default async function on({ ev, cht }) {
  console.log('[TOPUP] Modul topup.js aktif');

  const axios = (await import("axios")).default;
const fs = "fs".import()
const path = "path".import()

const DB_DIR = path.resolve('./database');
const MARKUP_PATH = path.join(DB_DIR, 'markup.json');

let markup = {
  game: 0,
  streaming: 0
};

// Load file
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

if (fs.existsSync(MARKUP_PATH)) {
  try {
    markup = JSON.parse(fs.readFileSync(MARKUP_PATH, "utf-8"));
  } catch (e) {
    console.warn("[MARKUP] Gagal baca markup.json");
  }
}
  const API_KEY = "KbpiP9XKlHViXcZk438TYGOKmTSxP7fgX3umF24OyEQcBcYbOIoGn4KcgDuOe9kX";
  const SIGN = "6b572f62e88e9b81b6364e52632e177e";

  async function postToAPI(url, params) {
    try {
      const { data } = await axios.post(url, new URLSearchParams({
        key: API_KEY,
        sign: SIGN,
        ...params
      }).toString(), {
        headers: {
  "Content-Type": "application/x-www-form-urlencoded",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Referer": "https://vip-reseller.co.id/",
}
      });
      return data;
    } catch (e) {
      return { error: e.message };
    }
  }
  
  ev.on({
  cmd: ['pay', 'pembayaran'],
  listmenu: ['pembayaran'],
  tag: "rshop",
  isOwner: false
}, async () => {
  cht.reply(`💰 *METODE PEMBAYARAN*

📲 *Transfer*:
- Dana: 085752583246
> A/N: R***i

📷 *Qris*: Minta Owner (jika tersedia)

💵 *Cash/Tunai*:
(Hanya untuk pelanggan dalam 1 kecamatan)

📨 *Kirim Bukti Pembayaran ke:*
https://wa.me/6285752583246`);
});

  ev.on({
  cmd: ['listproduct', 'lp'],
  listmenu: ['listproduct'],
  tag: "rshop",
  isOwner: false
}, async () => {
  cht.reply(`TOP UP GAME & AKUN APP PREMIUM READY:

App Premium:
1. Capcut 1B: 25k 🟨
2. Viu Lifetime: 15k 🟥
3. Alight Motion 1T: 5k 🟨
4. Youtube Premium Invite 1B: 7k 🟥
5. Netflix 1B (1P1U1D): 50k 🟩
6. Netflix 1B (1P1U2D): 60k 🟩
7. Alight Motion 1T: 10k 🟦
8. Capcut 1B: 35k 🟩
9. Vision PAYTV 1B: 20k🟦
10. Getcontact 1B: 17k🟦
11. Video Premier Platinum Private 1B: 30k 🟦
12. Amazon Prime Video Private 1A5P 1B: 20k 🟦
13. Amazon Prime Video Private 1A5P 1B: 35k 🟩
14. Spotify 1B: 38k 🟩

> *ChatGPT Teams*
1. Chat GPT Member 1B: 25k 🟨
2. Chat GPT Member 1B: 35k 🟩
3. Chat GPT Owner 1B: 75k 🟨
4. Chat GPT Owner 1B: 115k 🟩

*Perbedaan Member dan Owner di ChatGPT Tim Plan:*
- Member adalah anggota yang diundang oleh owner
- Owner adalah pemilik dari tim plan dan bisa mengundang 1-5 orang member

> *Bstation Premium (Jika sudah premium akan menambah durasi sesuai yang dibeli)*
1. Bstation 7H: 11k🟩
2. Bstation 14H: 16k🟩
3. Bstation 31H: 24k🟩
4. Bstation 93H: 73k🟦
5. Bstation 366H: 230k🟦

Garansi:
🟥: No Garansi
🟩: Full Garansi
🟨: Garansi 3-7 Hari
🟦: Garansi Setengah Durasi Premium

Stock: Tanyakan

Keterangan:
1B = 1 Bulan
1T = 1 Tahun
1A = 1 Akun
1P = 1 Profile
1U = 1 User
1D = 1 Device
1H = 1 Hari


Top up Game:
1. Free Fire
2. Mobile Legends
3. PUBG
4. Roblox
5. Magic Chess: GO GO


Joki Afk:
- Fish it

*Order: https://wa.me/6285752583246*`);
});
  
  ev.on({
  cmd: ['setharga'],
  listmenu: ['setharga'],
  tag: "rshop",
  isOwner: true,
  args: "Contoh: .setharga tf 10 atau .setharga cash 0"
}, async ({ args }) => {
  const [metode, persenStr] = args.trim().split(" ");
  const persen = parseFloat(persenStr);

  if (!metode || isNaN(persen)) {
    return cht.reply("❌ Format salah!\nContoh: .setharga tf 10");
  }

  markup[metode] = persen;

  try {
    fs.writeFileSync(MARKUP_PATH, JSON.stringify(markup, null, 2));
  } catch (e) {
    return cht.reply("❌ Gagal menyimpan markup!\n" + e.message);
  }

  const arah = persen > 0 ? "menaikkan" : "menurunkan";
  cht.reply(`✅ Markup metode *${metode}* diatur menjadi ${persen}% (${arah})`);
});

ev.on({
  cmd: ['getharga'],
  listmenu: ['getharga'],
  tag: "rshop",
  isOwner: true
}, async () => {
  if (!markup || typeof markup !== 'object' || Object.keys(markup).length === 0) {
    return cht.reply("📦 Belum ada markup yang diatur.");
  }

  let list = Object.entries(markup).map(([mtd, persen]) => {
    return `• ${mtd}: ${persen}%`;
  }).join("\n");

  cht.reply(`💰 *Markup Harga per Metode Pembayaran:*\n\n${list}`);
});

ev.on({
  cmd: ['oproduk'],
  listmenu: ['oproduk'],
  tag: "rshop",
  isOwner: true,
  args: "Contoh: .oproduk Mobile Legends atau .oproduk -"
}, async ({ args }) => {
  const axios = (await import("axios")).default;

  const API_KEY = "KbpiP9XKlHViXcZk438TYGOKmTSxP7fgX3umF24OyEQcBcYbOIoGn4KcgDuOe9kX";
  const SIGN = "6b572f62e88e9b81b6364e52632e177e";

  const keyword = args?.trim() || '-';

  const params = {
    key: API_KEY,
    sign: SIGN,
    type: "services",
    filter_type: "game",
    filter_status: "available"
  };

  if (keyword !== '-') {
    params.filter_value = keyword;
  }

  let result;
  try {
    const { data } = await axios.post("https://vip-reseller.co.id/api/game-feature", new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    result = data;
  } catch (e) {
    return cht.reply(`❌ Gagal ambil produk!\n${e.message}`);
  }

  if (!result?.result || result.data.length === 0) {
    return cht.reply(`❌ Produk tidak ditemukan untuk kata kunci: *${keyword}*`);
  }

  const grouped = {};
  for (const item of result.data) {
    if (!grouped[item.game]) grouped[item.game] = [];
    grouped[item.game].push(item);
  }

  let message = `🛠️ *Daftar Produk Asli (Owner Only)*\n${keyword !== '-' ? `(Filter: ${keyword})\n` : ""}\n`;

  for (const game in grouped) {
    message += `🕹️ *${game}*\n`;
    grouped[game].forEach(item => {
      message += `➤ [${item.code}] ${item.name}\n   💰 Rp ${item.price.basic}\n`;
    });
    message += `\n`;
  }

  cht.reply(message.trim());
});

  // ✅ .produk
 ev.on({
  cmd: ['produk'],
  listmenu: ['produk'],
  tag: "rshop",
  isOwner: false,
  args: "Contoh: .produk tf|mobile legends atau .produk cash|all"
}, async ({ args }) => {
  const axios = (await import("axios")).default;

  const API_KEY = "KbpiP9XKlHViXcZk438TYGOKmTSxP7fgX3umF24OyEQcBcYbOIoGn4KcgDuOe9kX";
  const SIGN = "6b572f62e88e9b81b6364e52632e177e";

  if (!args || !args.includes("|")) {
    return cht.reply(`📦 *Cara Melihat Produk:*
Gunakan format:
.produk <metode>|<filter>

Contoh:
• .produk tf|free fire
• .produk cash|mobile
• .produk tf|all
• .produk cash|all
`);
  }

  const [metode, filter] = args.split("|").map(s => s.trim().toLowerCase());
  const markupRate = markup[metode] ?? 0;

  const params = {
    key: API_KEY,
    sign: SIGN,
    type: "services",
    filter_type: "game",
    filter_status: "available"
  };

  if (filter !== "-" && filter !== "all") {
    params.filter_value = filter;
  }

  let result;
  try {
    const { data } = await axios.post("https://vip-reseller.co.id/api/game-feature", new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    result = data;
  } catch (e) {
    return cht.reply(`❌ Gagal ambil produk!\n${e.message}`);
  }

  if (!result?.result || result.data.length === 0) {
    return cht.reply(`❌ Produk tidak ditemukan untuk: *${filter}*`);
  }

  const grouped = {};
  for (const item of result.data) {
    if (!grouped[item.game]) grouped[item.game] = [];
    grouped[item.game].push(item);
  }

  let msg = `🎮 *Daftar Produk Game dan App Premium(Metode: ${metode.toUpperCase()})*\n`;

  if (filter === '-' || filter === 'all') {
    msg += `(Menampilkan semua layanan)\n\n`;
  } else {
    msg += `(Filter: ${filter})\n\n`;
  }

  for (const game in grouped) {
    msg += `🕹️ *${game}*\n`;
    grouped[game].forEach(item => {
      const harga = Math.round(item.price.basic * (1 + markupRate / 100));
      msg += `➤ [${item.code}] ${item.name}\n   💰 Rp ${harga}\n`;
    });
    msg += `\n`;
  }

  cht.reply(msg.trim());
});

  // ✅ .topup <kode>|<id>|[zone]
  ev.on({
    cmd: ['buy'],
    listmenu: ['buy'],
    tag: "rshop",
    isOwner: true,
    args: "Contoh: .buy ML14-S14|123456789|2685"
  }, async ({ args }) => {
    const [service, data_no, data_zone] = args.split("|").map(x => x?.trim());

    if (!service || !data_no) {
      return cht.reply("❌ Format salah!\nContoh: .buy ML14-S14|123456789|2685");
    }

    const params = {
      type: "order",
      service,
      data_no
    };

    if (data_zone) params.data_zone = data_zone;

    const result = await postToAPI("https://vip-reseller.co.id/api/game-feature", params);

    if (!result?.result) {
      return cht.reply(`❌ Gagal Membeli!\n${JSON.stringify(result, null, 2)}`);
    }

    const d = result.data;
    cht.reply(`✅ *Pembelian Berhasil Diproses!*\n\n🆔 TrxID: ${d.trxid}\n🎮 Layanan: ${d.service}\n👤 ID: ${d.data}\n🌐 Zone: ${d.zone || '-'}\n📦 Status: ${d.status}`);
  });

  // ✅ .cekstatus <trxid>
  ev.on({
    cmd: ['cekstatus'],
    listmenu: ['cekstatus'],
    tag: "rshop",
    isOwner: false,
    args: "Contoh: .cekstatus 1234567890"
  }, async ({ args }) => {
    if (!args) return cht.reply("❌ Masukkan ID transaksi!\nContoh: .cekstatus 1234567890");

    const result = await postToAPI("https://vip-reseller.co.id/api/game-feature", {
      type: "status",
      trxid: args
    });

    if (!result?.result) {
      return cht.reply(`❌ Gagal cek status!\n${JSON.stringify(result, null, 2)}`);
    }

    const d = result.data?.[0] || {};
    cht.reply(`📦 *Status Transaksi*\n\n🆔 TrxID: ${d.trxid || args}\n🎮 Layanan: ${d.service}\n👤 ID: ${d.data}\n🌐 Zone: ${d.zone || '-'}\n📶 Status: ${d.status}\n📝 Catatan: ${d.note || '-'}`);
  });
  
  ev.on({
  cmd: ['ip'],
  listmenu: ['ip'],
  tag: "owner",
  isOwner: true
}, async () => {
  const fetch = (await import("node-fetch")).default;

  try {
    const ipv4 = await fetch("https://ipv4.icanhazip.com").then(res => res.text());
    const ipv6 = await fetch("https://ipv6.icanhazip.com").then(res => res.text()).catch(() => "-");

    cht.reply(`🌐 *IP Publik Server (VPS)*\n\n🧭 IPv4: ${ipv4.trim()}\n🧭 IPv6: ${ipv6.trim()}`);
  } catch (e) {
    cht.reply(`❌ Gagal ambil IP: ${e.message}`);
  }
});

ev.on({
  cmd: ['cekid'],
  listmenu: ['cekid'],
  tag: "rshop",
  isOwner: false
}, async () => {
  const gameList = {
    "mobile legends": "mobile-legends",
    "hago": "hago",
    "zepeto": "zepeto",
    "lords mobile": "lords-mobile",
    "marvel super war": "marvel-super-war",
    "ragnarok m": "ragnarok-m-eternal-love-big-cat-coin",
    "speed drifters": "speed-drifters",
    "laplace m": "laplace-m",
    "valorant": "valorant",
    "higgs domino": "higgs-domino",
    "point blank": "point-blank",
    "dragon raja": "dragon-raja",
    "wild rift": "league-of-legends-wild-rift",
    "free fire": "free-fire",
    "free fire max": "free-fire-max",
    "tom and jerry": "tom-and-jerry-chase",
    "cocofun": "cocofun",
    "8 ball pool": "8-ball-pool",
    "auto chess": "auto-chess",
    "bullet angel": "bullet-angel",
    "aov": "arena-of-valor",
    "codm": "call-of-duty-mobile",
    "genshin": "genshin-impact",
    "indoplay": "indoplay",
    "gaple boyaa": "domino-gaple-qiuqiu-boyaa"
  };

  const daftar = Object.keys(gameList).map(g => `• ${g}`).join("\n");

  return cht.reply(`🎮 *Game yang Bisa Dicek Nickname-nya:*\n\n${daftar}\n\n🔍 Untuk cek nickname, gunakan:\n.idgame <nama game>|<user_id>[|<zone>]\nContoh:\n.idgame free fire|123456789\n.idgame mobile legends|12345678|1234`);
});

ev.on({
  cmd: ['idgame'],
  listmenu: ['idgame'],
  tag: "rshop",
  isOwner: false,
  args: "Contoh: .idgame free fire|12345678 atau .idgame mobile legends|12345678|1234"
}, async ({ args }) => {
  const fetch = (await import("node-fetch")).default;

  const gameList = {
    "mobile legends": "mobile-legends",
    "hago": "hago",
    "zepeto": "zepeto",
    "lords mobile": "lords-mobile",
    "marvel super war": "marvel-super-war",
    "ragnarok m": "ragnarok-m-eternal-love-big-cat-coin",
    "speed drifters": "speed-drifters",
    "laplace m": "laplace-m",
    "valorant": "valorant",
    "higgs domino": "higgs-domino",
    "point blank": "point-blank",
    "dragon raja": "dragon-raja",
    "wild rift": "league-of-legends-wild-rift",
    "free fire": "free-fire",
    "free fire max": "free-fire-max",
    "tom and jerry": "tom-and-jerry-chase",
    "cocofun": "cocofun",
    "8 ball pool": "8-ball-pool",
    "auto chess": "auto-chess",
    "bullet angel": "bullet-angel",
    "aov": "arena-of-valor",
    "codm": "call-of-duty-mobile",
    "genshin": "genshin-impact",
    "indoplay": "indoplay",
    "gaple boyaa": "domino-gaple-qiuqiu-boyaa"
  };

  const API_KEY = "KbpiP9XKlHViXcZk438TYGOKmTSxP7fgX3umF24OyEQcBcYbOIoGn4KcgDuOe9kX";
  const SIGN = "6b572f62e88e9b81b6364e52632e177e";
  const API_URL = "https://vip-reseller.co.id/api/game-feature";

  const parts = args.split("|").map(p => p.trim());
  const gameName = parts[0]?.toLowerCase();
  const userId = parts[1];
  const zoneId = parts[2] || null;

  if (!gameName || !userId) {
    return cht.reply("❌ Format salah!\nContoh:\n.idgame free fire|12345678\n.idgame mobile legends|12345678|1234");
  }

  const code = gameList[gameName];
  if (!code) {
    return cht.reply(`❌ Game *${gameName}* tidak ditemukan!\nKetik *.cekid* untuk melihat daftar.`);
  }

  const payload = {
    key: API_KEY,
    sign: SIGN,
    type: "get-nickname",
    code,
    target: userId
  };

  if (zoneId) payload.additional_target = zoneId;

  const body = new URLSearchParams(payload);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();

    if (data.result && data.data) {
      return cht.reply(`✅ *Nickname Ditemukan:*\n\n👤 ID: ${userId}${zoneId ? `\n🌐 Zone: ${zoneId}` : ""}\n📛 Nickname: ${data.data}`);
    } else {
      return cht.reply(`❌ Gagal mendapatkan nickname:\n${JSON.stringify(data, null, 2)}`);
    }

  } catch (e) {
    return cht.reply(`❌ Error saat koneksi:\n${e.message}`);
  }
});

  // ✅ .oprofile (khusus owner)
  ev.on({
    cmd: ['oprofile'],
    listmenu: ['oprofile'],
    tag: "rshop",
    isOwner: true
  }, async () => {
    const result = await postToAPI("https://vip-reseller.co.id/api/profile", {});

    if (!result?.result || !result.data) {
      return cht.reply(`❌ Gagal ambil data profil!\n${JSON.stringify(result, null, 2)}`);
    }

    const p = result.data;
    cht.reply(`👤 *Profil Akun Reseller*\n\n📛 Nama: ${p.full_name}\n🔖 Username: ${p.username}\n💰 Saldo: Rp ${p.balance}\n⭐ Level: ${p.level}\n📅 Daftar: ${p.registered}`);
  });
}