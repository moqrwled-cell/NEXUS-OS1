async function test() {
  const areaId = 3604479752; // Dubai
  
  const overpassQuery = `
    [out:json][timeout:25];
    area(${areaId})->.searchArea;
    (
      nwr["amenity"="cafe"](area.searchArea);
    );
    out center tags 100;
  `;

  console.time('overpass');
  const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'NexusOS-Test'
    },
    body: 'data=' + encodeURIComponent(overpassQuery)
  });
  console.timeEnd('overpass');

  if (!res.ok) {
    console.log(res.status, await res.text());
    return;
  }
  
  const data = await res.json();
  console.log("Found", data.elements.length);
}
test();
