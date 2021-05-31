var db = [];
fetch("list", {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((res) => res.json())
    .then((data) => db = data);

function popUpDetail() {
  var detail = document.createElement('div');

  detail.setAttribute("id", "detail");
  detail.innerHTML = '<div id="map" style="width:300px; height:300px; position:relative; overflow:hidden; display:inline-block;"></div>';

  document.getElementById('appointment_list').appendChild(detail);

  var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.4980854357918, 127.028000275071), // 지도의 중심좌표
      draggable: false,
      level: 3 // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);
  var iwContent = '<div style="padding:5px; text-align:center;">강남역</div>'

  var markerPosition  = new kakao.maps.LatLng(37.4980854357918, 127.028000275071);
  var marker = new kakao.maps.Marker({
    position: markerPosition
  }),
    infowindow = new kakao.maps.InfoWindow({
      position : markerPosition,
      content: iwContent,
      zIndex: 1,
      disableAutoPan: true
    });

  marker.setMap(map);
  infowindow.open(map, marker);

  var addr = document.createElement('div');

  addr.setAttribute("id", "addr");
  addr.innerHTML = '서울 강남구 강남대로 지하 396';

  document.getElementById('appointment_list').appendChild(addr);

  var users = document.createElement('div');

  users.setAttribute("id", "users");
  users.innerHTML = "user1 : 경기도 성남시 분당구 미금로 114 <input type='button' value='경로 안내' onclick='location.href=nav' />" ;

  document.getElementById('appointment_list').appendChild(users);
}
