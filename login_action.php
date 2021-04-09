<?php
 
        session_start();
 
        $connect = mysqli_connect("localhost", "root", "meetingplace", "db") or die("fail");
 
        $id=$_POST['id'];
        $pw=$_POST['pw'];   //입력 받은 id와 password
 
        $query = "select * from member where id='$id'";
        $result = $connect->query($query);    //아이디가 있는지 검사
     
        if(mysqli_num_rows($result)==1) {
 
                $row=mysqli_fetch_assoc($result);  //아이디가 있다면 비밀번호 검사
 
             
                if($row['pw']==$pw){
                        $_SESSION['userid']=$id; 
                        if(isset($_SESSION['userid'])){  //비밀번호가 맞다면 세션 생성
                        ?>      <script>
                                        alert("로그인 되었습니다.");
                                        location.replace(" ");  //로그인성공한뒤어디페이지로이동할지
                                </script> 
<?php
                        }
                        else{
                                echo "session fail";
                        }
                }
 
                else {
        ?>              <script>
                                alert("아이디 혹은 비밀번호가 잘못되었습니다.");
                                history.back();
                        </script> 


