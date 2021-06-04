var container = document.getElementById('map'),
    options = {
         center: new kakao.maps.LatLng(33.450701, 126.570667),
         level: 3
    };

var map = new kakao.maps.Map(container, options);

function pubTransRoute(sx, sy, ex, ey) {
  
}

var sx = 126.93737555322481;
var sy = 37.55525165729346;
var ex = 126.88265238619182;
var ey = 37.481440035175375;

var points = [
  new kakao.maps.LatLng(sy, sx),
  new kakao.maps.LatLng(ey, ex),
];



// 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
var bounds = new kakao.maps.LatLngBounds(); 

function searchPubTransPathAJAX() {
  var xhr = new XMLHttpRequest();
  //ODsay apiKey 입력
  var url = "https://api.odsay.com/v1/api/searchPubTransPath?SX=" + sx + "&SY=" + sy + "&EX=" + ex + "&EY=" + ey + "&apiKey=OoGUdTDFP1HFXbxR8Hlhw26caS4vBemnMMBPlDPYTJw";
  xhr.open("GET", url, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(JSON.parse(xhr.responseText)); // <- xhr.responseText 로 결과를 가져올 수 있음
      //노선그래픽 데이터 호출
      callMapObjApiAJAX((JSON.parse(xhr.responseText))["result"]["path"][0].info.mapObj);
    }
  }
}

//길찾기 API 호출
searchPubTransPathAJAX();

function callMapObjApiAJAX(mabObj) {
  var xhr = new XMLHttpRequest();
  //ODsay apiKey 입력
  var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@" + mabObj + "&apiKey=OoGUdTDFP1HFXbxR8Hlhw26caS4vBemnMMBPlDPYTJw";
  xhr.open("POST", url, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log( JSON.parse(xhr.responseText) ); // <- xhr.responseText 로 결과를 가져올 수 있음
      var resultJsonData = JSON.parse(xhr.responseText);

      drawKakaoMarker(sx,sy);					// 출발지 마커 표시
      drawKakaoMarker(ex,ey);					// 도착지 마커 표시
      drawKakaoPolyLine(resultJsonData);
      setBounds(bounds);
    }
  }
}

var i, marker;
for (i = 0; i < points.length; i++) {
    // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
    marker =     new kakao.maps.Marker({ position : points[i] });
    marker.setMap(map);
    
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(points[i]);
}

function setBounds() {
    // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
    // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
    map.setBounds(bounds);
}

// 지도위 마커 표시해주는 함수
function drawKakaoMarker(x, y) {
  var marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(y, x)
  });
  marker.setMap(map);
}

// 노선그래픽 데이터를 이용하여 지도위 폴리라인 그려주는 함수
function drawKakaoPolyLine(data) {
  var lineArray;

  for (var i = 0; i < data.result.lane.length; i++) {
    for (var j = 0; j < data.result.lane[i].section.length; j++) {
      lineArray = null;
      lineArray = new Array();
      for (var k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
        lineArray.push(new kakao.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
      }

      //지하철결과, 버스결과의 경우 노선에 따른 라인색상 지정하는 부분 (1~9호선 색상 추가)
      if (data.result.lane[i].type === 1) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#0D347F'
        });
      } else if (data.result.lane[i].type === 2) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#3B9F37'
        });
      } else if (data.result.lane[i].type === 3) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#fc4c02'
        });
      } else if (data.result.lane[i].type == 4) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#3165A8'
        });
      } else if (data.result.lane[i].type == 5) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#a05eb5'
        });
      } else if (data.result.lane[i].type == 6) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#904D23'
        });
      } else if (data.result.lane[i].type == 7) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#5B692E'
        });
      } else if (data.result.lane[i].type == 8) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#e31c79'
        });
      } else if (data.result.lane[i].type == 9) {
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#B39627'
        });
      } else { // 버스의 경우
        var polyline = new kakao.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeColor: '#3673dd'
        });
      }
      polyline.setMap(map); // 지도에 올린다.
    }
  }
}