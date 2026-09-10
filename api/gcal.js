// 구글캘린더 iCal 비공개 주소를 서버에서 대신 받아온다 (브라우저 CORS 우회).
// calendar.google.com 주소만 허용해 오픈 프록시로 악용되지 않게 한다.
module.exports = async (req, res) => {
  const url = (req.query && req.query.url) || '';
  if (!/^https:\/\/calendar\.google\.com\//.test(url)) {
    res.status(400).json({ error: 'calendar.google.com URL만 허용됩니다.' });
    return;
  }
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) {
      res.status(502).json({ error: '구글캘린더 응답 오류: ' + r.status });
      return;
    }
    const text = await r.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message || e) });
  }
};
