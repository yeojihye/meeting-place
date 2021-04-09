<?php
include ("./db.php"); 

 
        $connect = mysqli_connect('localhost', 'root', 'meetingplace', 'dbname') or die("fail");
        
 
        $id=$_GET[id];
        $pw=$_GET[pw];
        $email=$_GET[email];
        $univ=$_GET[univ];

 
        $date = date('Y-m-d H:i:s');
 
        $query = "insert into member (id, pw, mail, univ, date, permit) values ('$id', '$pw', '$univ', '$email', '$date', 0)";
             //입력받은 데이터를 DB에 저장
 
        $result = $connect->query($query);
 

        if($result) {
        ?>      <script>
                alert('가입 되었습니다.');
                location.replace(".index.html");  //저장됐다면 (result = true) 가입 완료
                </script>
 
<?php   }
        else{
?>              <script>
                        
                        alert("fail");
                </script>
<?php   }
 
        mysqli_close($connect);
?>

