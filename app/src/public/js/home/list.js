var mapCount = 1;
var geocoder = new kakao.maps.services.Geocoder();
var con_count = 1;
Kakao.init('020bb9f07f28ca7f066538c8a2938c03');

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
    $('#appointment_list').append(`<li id="list${i + 1}" class="list_title" onclick="popUpDetail(${i + 1})">${db[i].place_name}</li><div id="div${i + 1}"></div><br>`);
  }
}

async function removePlace(cnt) {
  if (confirm(`약속을 삭제하시겠습니까?`) == true) {
    const req = {
      cnt: cnt,
    };
    const res = await fetch("list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    })
    const data = await res.json();
    location.reload();
    return data;
  } else {
    return;
  }
}

async function popUpDetail(listOrder) {
  const detailDiv = document.getElementById(`detail${listOrder}`);

  if (detailDiv) {
    detailDiv.remove();
  } else {
    const db = await getHistoryDb();
    var index = listOrder - 1;
    var cnt = db[index].cnt;

    var detail = document.createElement('div');
    detail.setAttribute("id", `detail${listOrder}`);
    document.getElementById(`div${listOrder}`).appendChild(detail);

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
    addr.innerHTML = "<br>주소 : " + db[index].addr;
    // addr.innerHTML += `<a id="create-kakao-link-btn${index}" href="javascript:;">
    // <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"/></a>`

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
          users.innerHTML += "<br><div id='userbar'>user" + userCnt;

          if (result[0].road_address == null) {
            users.innerHTML += result[0].address.address_name;
            var user_addr = result[0].address.address_name;
          } else {
            users.innerHTML += result[0].road_address.address_name;
            var user_addr = result[0].road_address.address_name;
          }

          var mapUrl = `https://map.kakao.com/?sName=${user_addr}&eName=${db[index].addr}`;
          var mobileUrl = `https://m.map.kakao.com/actions/publicRoute?startLoc=${user_addr}&sxEnc=MMSNLS&syEnc=QOQRQPS&endLoc=${db[index].addr}&exEnc=MOPLUM&eyEnc=QNOMSNN`;

          users.innerHTML += "<br>" + ` &nbsp; <input type='button' value='경로 안내' onclick="location.href='https://map.kakao.com/?sName=${user_addr}&eName=${db[index].addr}';"/>
          <a id="kakao-link-btn${con_count}" href='javascript:sendLink("${db[index].addr}", "${db[index].place_name}", "${mapUrl}", "${mobileUrl}")'>
          <img class='kakao' src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" /align="middle"></a><hr>`;
          // createLink(db[index], con_count, mapUrl, mobileUrl);
          userCnt++;
          con_count++;
        }
      }

      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }

    var deleteButton = document.createElement('div');
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.innerHTML += `<br><input type='button' value='약속 삭제' onclick='removePlace(${cnt})'/>`;

    document.getElementById(detail.id).appendChild(users);
    document.getElementById(detail.id).appendChild(deleteButton);
    // createLink(db[index], index);
  }
}

function createLink(db, i, mapUrl, mobileUrl) {
  Kakao.Link.createDefaultButton({
    container: `#kakao-link-btn${i}`,
    objectType: 'location',
    address: db.addr,
    content: {
      title: db.place_name,
      description: db.addr,
      imageUrl: 'http://k.kakaocdn.net/dn/bSbH9w/btqgegaEDfW/vD9KKV0hEintg6bZT4v4WK/kakaolink40_original.png',
      link: {
        mobileWebUrl: mobileUrl,
        webUrl: mapUrl,
      },
    },
  })
}

function sendLink(addr, title, mapUrl, mobileUrl) {
  Kakao.Link.sendDefault({
    objectType: 'location',
    address: addr,
    addressTitle: title,
    content: {
      title: title,
      description: addr,
      imageUrl: 'http://k.kakaocdn.net/dn/bSbH9w/btqgegaEDfW/vD9KKV0hEintg6bZT4v4WK/kakaolink40_original.png',
      link: {
        mobileWebUrl: mobileUrl,
        webUrl: mapUrl,
      },
    },
    buttons: [{
      title: '웹으로 보기',
      link: {
        mobileWebUrl: mobileUrl,
        webUrl: mapUrl,
      },
    }, ],
  })
}
