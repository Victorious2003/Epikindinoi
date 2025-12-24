<?php
// get_images.php
header('Content-Type: application/json');
require 'db_connect.php';

$sql = "SELECT * FROM gallery_images ORDER BY upload_date DESC";
$result = $conn->query($sql);

$images = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['image_data'] = base64_encode($row['image_data']);
        $images[] = $row;
    }
}

echo json_encode($images);
$conn->close();
?>