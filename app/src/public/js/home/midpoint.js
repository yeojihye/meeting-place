var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
var storage = window.sessionStorage; // 세션 스토리지
var count = 1; // 사용자 수
var coords_list = []; // bounds 설정에 사용될 LatLng 형식 좌표 저장
var decimal = []; // geolocation 위도 경도 저장
var radian = []; // radian 형식 좌표
var cartesian = []; // cartesian 형식 좌표

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
var bounds = new kakao.maps.LatLngBounds();

for (var i = 0; i < storage.length; i++) {

    // 검색된 위치의 위도 경도 저장
    decimal.push(JSON.parse(storage.getItem(storage.key(i)))[0]);
    decimal.push(JSON.parse(storage.getItem(storage.key(i)))[1]);

    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(JSON.parse(storage.getItem(storage.key(i)))[0], JSON.parse(storage.getItem(storage.key(i)))[1]), // 마커를 표시할 위치
        title: "사용자" + storage.key(i), // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage // 마커 이미지
    });

    coords_list.push(new kakao.maps.LatLng(JSON.parse(storage.getItem(storage.key(i)))[0], JSON.parse(storage.getItem(storage.key(i)))[1]));

    count++;
}

function search_mid() {

    var X = 0,
        Y = 0,
        Z = 0;

    for (var i = 0; i < decimal.length - 1; i += 2) {
        radian.push(decimal[i] * (Math.PI / 180));
        radian.push(decimal[i + 1] * (Math.PI / 180));
    }

    for (var i = 0; i < radian.length - 1; i += 2) {
        cartesian.push(Math.cos(radian[i]) * Math.cos(radian[i + 1]));
        cartesian.push(Math.cos(radian[i]) * Math.sin(radian[i + 1]));
        cartesian.push(Math.sin(radian[i]));
    }

    for (var i = 0; i < cartesian.length - 2; i += 3) {
        X += cartesian[i];
        Y += cartesian[i + 1];
        Z += cartesian[i + 2];
    }

    X = X / (radian.length / 2);
    Y = Y / (radian.length / 2);
    Z = Z / (radian.length / 2);

    var Lon = Math.atan2(Y, X);
    var Hyp = Math.sqrt(X * X + Y * Y);
    var Lat = Math.atan2(Z, Hyp);

    Lon = (Lon * (180 / Math.PI)).toFixed(6);
    Lat = (Lat * (180 / Math.PI)).toFixed(6);

    // 중간지점 마커 정
    var mid_imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
    var mid_imageSize = new kakao.maps.Size(64, 64);
    var mid_markerImage = new kakao.maps.MarkerImage(mid_imageSrc, mid_imageSize);

    var mid_marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(Lat, Lon),
        image: mid_markerImage
    });

    var iwContent = "Here!", // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
    });

    // 인포윈도우를 마커위에 표시합니다
    infowindow.open(map, mid_marker);

    showPlacelist(Lat, Lon);
    runAjax();
}

// toggle
function toggle() {
    var con = document.getElementById("subwayList");
    if (con.style.display == 'none') {
        con.style.display = 'block';
        markSubway();
    } else {
        con.style.display = 'none';
        backToMid();
    }
}

// 거리상 중간지점으로 돌아가기
function backToMid() {
    subX = [];
    subT = [];
    location.reload(true);
    location.href = location.href;

    history.go(0);
}

// 근처 지하철역 마다 마커 표시
function markSubway() {
    var imageSrc = 'https://ifh.cc/g/1R5ZJ7.png', // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(30, 30), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    for (var i = 0; i < subX.length; i++) {
        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition = new kakao.maps.LatLng(subY[i], subX[i]); // 마커가 표시될 위치입니다

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage // 마커이미지 설정
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
    }

}

// 원 초기 설정 
var circle = new kakao.maps.Circle({
    map: map,
    center : new kakao.maps.LatLng(33.450701, 126.570667),
    radius: 1000, // 반경 1km
});
circle.setMap(map);

// db에 있는 장소들이 영역내에 있는지 확인하고, 추천리스트를 출력하는 함수
function checkRecommendData(y, x) {
    // db에 있는 데이터를 가져온다.
    fetch('/getdb')
    .then(res => res.json())
    .then(res => {
        // 추천리스트 초기화
        $("#recommendList *").remove();
        var mid_point = new kakao.maps.LatLng(y, x);
        // 지도에 그려진 원 모두 삭제
        circle.setMap(null);
        // 중심좌표를 중심으로 원 그리기
        circle.setMap(map);
        circle.setPosition(mid_point);
        // 원을 포함하는 최소의 사각형 영역을 구한다.
        var midBounds = circle.getBounds();
        // db에 있는 장소좌표가 영역 내에 있으면 리스트로 출력한다. 
        for (var i = 0; i < res.length; i++) {
            var dbcoord = new kakao.maps.LatLng(res[i].lat, res[i].lng);
            if (midBounds.contain(dbcoord)) {
                $("#recommendList").append("<li>"+res[i].place_name+"</li>");
            }
        };
    });
}

function showPlacelist(y, x) {
    checkRecommendData(y, x);
    // 중심좌표 변수
    mid_point = new kakao.maps.LatLng(y, x);
    // 중심좌표를 지도 중심으로 설정
    map.setCenter(mid_point);
    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    // 음식점 장소를 검색합니다
    searchFD(); // 첫 화면
}

// 근처 지하철역의 위도와 경도 배열
var subY = [];
var subX = [];

// 근처 지하철역 리스트 출력하고 좌표를 리스트에 푸시
function runAjax() {
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v2/local/search/category",
        data: { category_group_code: "SW8", y: mid_point.Ma, x: mid_point.La, radius: 10000, sort: "distance" },
        headers: { Authorization: "KakaoAK 2dcb41dfc98f544a4a6d8e0f9828cdc5" } //REST API 키
    })
        .done(function (msg) {
            for (var i = 0; i < 5; i++) { // 지하철역 최대 5개까지 출력
                $("#subwayList").append("<li><input type='radio' onclick='changeSub(event)' name='place_name' value=" +
                    i + ">" + msg.documents[i].place_name + "</li>")
                subY.push(msg.documents[i].y);
                subX.push(msg.documents[i].x);
            }
        });
}

// 근처 지하철역을 중간지점으로 설정
function changeSub(event) {
    for (var i = 0; i < 5; i++) {
        if (event.target.value == i) {
            showPlacelist(subY[i], subX[i]);
        }
    }
}

// 마커를 담을 배열입니다
var markers = [];

function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}
// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.getElementById('centerAddr');

        for (var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].region_3depth_name;
                break;
            }
        }
    }
}
// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();
// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow2 = new kakao.maps.InfoWindow({
    zIndex: 1,
    disableAutoPan: true
});

// 음식점 코드 검색을 요청하는 함수입니다
function searchFD() {
    // 정렬 방식으로 거리순을 선택하였을 경우
    if (sortby.value == "DISTANCE") {
        ps.categorySearch('FD6', placesSearchCB, {
            // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
            location: mid_point,
            radius: radius.value,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
        return;
    }
    // 장소검색 객체를 통해 음식점 코드 검색을 요청합니다
    ps.categorySearch('FD6', placesSearchCB, {
        // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
        location: mid_point,
        radius: radius.value,
    });
}

// 지하철역 코드 검색을 요청하는 함수입니다
function searchSW() {
    // 정렬 방식으로 거리순을 선택하였을 경우
    if (sortby.value == "DISTANCE") {
        ps.categorySearch('SW8', placesSearchCB, {
            // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
            location: mid_point,
            radius: radius.value,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
        return;
    }
    // 장소검색 객체를 통해 음식점 코드 검색을 요청합니다
    ps.categorySearch('SW8', placesSearchCB, {
        // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
        location: mid_point,
        radius: radius.value,
    });
}

// 문화시설 코드 검색을 요청하는 함수입니다
function searchCT() {
    // 정렬 방식으로 거리순을 선택하였을 경우
    if (sortby.value == "DISTANCE") {
        ps.categorySearch('CT1', placesSearchCB, {
            // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
            location: mid_point,
            radius: radius.value,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
        return;
    }
    // 장소검색 객체를 통해 음식점 코드 검색을 요청합니다
    ps.categorySearch('CT1', placesSearchCB, {
        // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
        location: mid_point,
        radius: radius.value,
    });
}

// 카페 코드 검색을 요청하는 함수입니다
function searchCE() {
    // 정렬 방식으로 거리순을 선택하였을 경우
    if (sortby.value == "DISTANCE") {
        ps.categorySearch('CE7', placesSearchCB, {
            // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
            location: mid_point,
            radius: radius.value,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
        return;
    }
    // 장소검색 객체를 통해 음식점 코드 검색을 요청합니다
    ps.categorySearch('CE7', placesSearchCB, {
        // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
        location: mid_point,
        radius: radius.value,
    });
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        displayPagination(pagination);
        removeMarker();
        document.getElementById('placesList').innerHTML = "<h1>검색 결과가 존재하지 않습니다.</h1><br/>";
        return;


    } else if (status === kakao.maps.services.Status.ERROR) {
        displayPagination(pagination);
        removeMarker();
        document.getElementById('placesList').innerHTML = "<h1>검색 결과 중 오류가 발생했습니다.</h1><br/>";
        return;

    }
}
// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {

    var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for (var i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때                   
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                displayInfowindow(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow2.close();
            });

            itemEl.onmouseover = function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout = function () {
                infowindow2.close();
            };

            itemEl.onclick = function () {
                map.setBounds(bounds);
                getAddress(title, placePosition);
            }
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}
function getAddress(title, placePosition) {
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v2/local/geo/coord2address",
        data: { y: placePosition.Ma, x: placePosition.La },
        headers: { Authorization: "KakaoAK 2dcb41dfc98f544a4a6d8e0f9828cdc5" } //REST API 키
    })
        .done(function (msg) {
            var address = msg.documents[0].address;
            confirm_place(title, placePosition, address);
        });
}
function confirm_place(title, placePosition, address) {
    if (confirm(`${title}을(를) 선택하시겠습니까?`) == true){
        const req = {
            name: title,
            lat: placePosition.Ma,
            lng: placePosition.La,
            addr: address,
        };
                    
    fetch("/midpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            // location.href = "/"; // 장소공유 및 경로안내 페이지로 이동
          } else {
            if (res.err) return alert(res.err);
            alert(res.msg);
          }
        })
        .catch((err) => {
          console.error("장소 데이터 저장 중 에러 발생");
        });              
    } else {
        return;
    }
    
}
// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function (i) {
                return function () {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}
// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}
// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}
// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow2.setContent(content);
    infowindow2.open(map, marker);
}
// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

    var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
            '<div class="info">' +
            '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone +
        ' <a href="' + places.place_url + '" target="_blank" style="text-decoration:underline;color:blue;">상세</a>' + '</span></div>';
    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}
// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker); // 배열에 생성된 마커를 추가합니다

    return marker;
}

function wide_view() {
    // 지도 범위 재설정에 사용될 bounds 추가
    for (var i = 0; i < coords_list.length; i++) {
        bounds.extend(coords_list[i]);
    }
    // 지도 범위 재설정
    map.setBounds(bounds);
}
