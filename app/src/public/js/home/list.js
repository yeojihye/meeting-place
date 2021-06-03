var mapCount = 1;
var geocoder = new kakao.maps.services.Geocoder();

async function getHistoryDb() {
  const res = await fetch("list", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json();
  return data;
}

async function load() {
  const db = await getHistoryDb();
  for (var i = 0; i < db.length; i++) {
    $('#appointment_list').append(`<li id="list${i + 1}">약속${i + 1} - ${db[i].place_name}, ${db[i].addr}
    <input type="button" value="상세 정보" onclick="popUpDetail(${i + 1});">  <input type="button" value="약속 취소" onclick="removePlace(${db[i].cnt});"></li><br>`);
  }
}

async function popUpDetail(listOrder) {
  const detailDiv = document.getElementById(`detail${listOrder}`);

  if (detailDiv) {
    detailDiv.remove();
  }

  else {
    const db = await getHistoryDb();
    var index = listOrder - 1;

    var detail = document.createElement('div');
    detail.setAttribute("id", `detail${listOrder}`);
    document.getElementById(`list${listOrder}`).appendChild(detail);

    detail.innerHTML += '<br><div id="' + detail.id + '_map" style="width:300px; height:300px; position:relative; overflow:hidden; display:inline-block;"></div>';
    var mapContainer = document.getElementById(detail.id + '_map'), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(db[index].lat, db[index].lng), // 지도의 중심좌표
        draggable: false,
        level: 3 // 지도의 확대 레벨
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);
    var iwContent = '<div style="padding:5px; text-align:center;">' + db[index].place_name + '</div>';

    var markerPosition = new kakao.maps.LatLng(db[index].lat, db[index].lng);
    var marker = new kakao.maps.Marker({
      position: markerPosition
    }),
      infowindow = new kakao.maps.InfoWindow({
        position: markerPosition,
        content: iwContent,
        zIndex: 1,
        disableAutoPan: true
      });

    marker.setMap(map);
    infowindow.open(map, marker);

    var addr = document.createElement('div');

    addr.setAttribute("id", "addr");
    addr.innerHTML = "<br>약속 장소 주소 : " + db[index].addr;

    document.getElementById(detail.id).appendChild(addr);

    var users = document.createElement('div');

    users.setAttribute("id", "users");

    var starting_position = JSON.parse(db[index].starting_position);
    var starting_lat = {};
    var starting_lng = {};
    var userCnt = 1;

    for (var i in starting_position) {
      var coord = starting_position[i].split(',');
      starting_lat[i] = coord[0];
      starting_lng[i] = coord[1];
    };

    for (var i in starting_lat) {
      var coord = new kakao.maps.LatLng(starting_lat[i], starting_lng[i]);
      var callback = function coord2AddressCallback(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          users.innerHTML += "user" + userCnt + ": ";

          if (result[0].road_address == null) {
            users.innerHTML += result[0].address.address_name;
          } else {
            users.innerHTML += result[0].road_address.address_name;
          }

          users.innerHTML += "&nbsp; <input type='button' value='경로 안내' onclick=location.href='nav' /><br>";
          userCnt++;
        }
      }

      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }

    document.getElementById(detail.id).appendChild(users);
  }
}