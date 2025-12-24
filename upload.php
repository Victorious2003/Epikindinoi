<?php
// upload.php
header('Content-Type: application/json'); // Επιστρέφουμε JSON για την JS
require 'db_connect.php';

$response = array('success' => false, 'message' => '', 'data' => null);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Έλεγχος αν υπάρχουν τα πεδία
    if (isset($_FILES['file']) && isset($_POST['submitter_name'])) {
        $file = $_FILES['file'];
        $submitterName = mysqli_real_escape_string($conn, $_POST['submitter_name']);
        $description = isset($_POST['description']) ? mysqli_real_escape_string($conn, $_POST['description']) : '';
        
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        
        $fileExt = explode('.', $fileName);
        $fileActualExt = strtolower(end($fileExt));
        $allowed = array('jpg', 'jpeg', 'png', 'gif');

        if (in_array($fileActualExt, $allowed)) {
            if ($fileError === 0) {
                if ($fileSize < 5000000) { // 5MB όριο
                    
                    // Δημιουργία μοναδικού ονόματος αρχείου
                    $fileNameNew = uniqid('', true) . "." . $fileActualExt;
                    $fileDestination = 'uploads/' . $fileNameNew;

                    // Δημιουργία φακέλου αν δεν υπάρχει
                    if (!file_exists('uploads')) {
                        mkdir('uploads', 0777, true);
                    }

                    if (move_uploaded_file($fileTmpName, $fileDestination)) {
                        
                        // Εισαγωγή στη βάση δεδομένων
                        $sql = "INSERT INTO gallery_images (submitter_name, description, image_url) VALUES ('$submitterName', '$description', '$fileDestination')";
                        
                        if ($conn->query($sql) === TRUE) {
                            $last_id = $conn->insert_id;
                            
                            // Ετοιμάζουμε τα δεδομένα για να τα στείλουμε πίσω στην JS
                            $newImage = array(
                                'id' => $last_id,
                                'submitter_name' => $submitterName, // Στέλνουμε το καθαρό όνομα
                                'description' => $description,
                                'image_url' => $fileDestination,
                                'category' => 'all'
                            );

                            $response['success'] = true;
                            $response['message'] = 'Η εικόνα ανέβηκε επιτυχώς!';
                            $response['data'] = $newImage;
                        } else {
                            $response['message'] = 'Σφάλμα βάσης δεδομένων: ' . $conn->error;
                        }
                    } else {
                        $response['message'] = 'Αποτυχία μετακίνησης αρχείου.';
                    }
                } else {
                    $response['message'] = 'Το αρχείο είναι πολύ μεγάλο (Max 5MB).';
                }
            } else {
                $response['message'] = 'Υπήρξε σφάλμα κατά το ανέβασμα.';
            }
        } else {
            $response['message'] = 'Μη έγκυρος τύπος αρχείου (μόνο jpg, jpeg, png, gif).';
        }
    } else {
        $response['message'] = 'Παρακαλώ συμπληρώστε όλα τα πεδία.';
    }
} else {
    $response['message'] = 'Μη έγκυρο αίτημα.';
}

echo json_encode($response);
$conn->close();
?>