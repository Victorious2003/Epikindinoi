<?php
$servername = "sql110.infinityfree.com";
$username = "if0_40659362";
$password = "987n123k456nk";
$dbname = "if0_40659362_drakensang";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ipostiriksi ellinikon xaraktiron
$conn->set_charset("utf8");
?>