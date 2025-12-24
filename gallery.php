<?php
session_start();

// --- ΡΥΘΜΙΣΕΙΣ ---
$admin_password = "dso123456"; // Ο κωδικός πρόσβασης για το admin
$folder_path = "uploads/";   
// -----------------

// 1. UPLOAD
if (isset($_POST['upload_image'])) {
    $target_file = $folder_path . basename($_FILES["fileToUpload"]["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $uploadOk = 1;

    // Έλεγχος
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check === false) { $uploadOk = 0; echo "<script>alert('Δεν είναι εικόνα.');</script>"; }
    
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
        $uploadOk = 0; echo "<script>alert('Μόνο JPG, JPEG, PNG & GIF.');</script>";
    }

    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            header("Location: gallery.php");
            exit;
        } else {
            echo "<script>alert('Σφάλμα ανεβάσματος.');</script>";
        }
    }
}

// 2. LOGIN
if (isset($_POST['login_pass'])) {
    if ($_POST['login_pass'] === $admin_password) {
        $_SESSION['is_admin'] = true;
    } else {
        echo "<script>alert('Λάθος κωδικός!');</script>";
    }
}

// 3. LOGOUT
if (isset($_POST['logout'])) {
    session_destroy();
    header("Location: gallery.php");
    exit;
}

// 4. DELETE
if (isset($_POST['delete_file']) && isset($_SESSION['is_admin'])) {
    $file = $_POST['delete_file'];
    if (strpos($file, $folder_path) === 0 && file_exists($file)) {
        unlink($file);
        header("Location: gallery.php");
        exit;
    }
}

$isAdmin = isset($_SESSION['is_admin']);
?>

<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery - Επικίνδυνοι</title>
    <link rel="stylesheet" href="index.css">
    <link rel="icon" href="images/logo.jpg">
    <link rel="stylesheet" href="gallery.css">
    <link rel="stylesheet" href="back-to-top.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="navbar-brand">
                <img src="images/logo.gif" alt="Επικίνδυνοι Logo" class="logo">
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Αρχική</a></li>
                <li><a href="news.html">Νέα Παιχνιδιού</a></li>
                <li><a href="guild.html">Η Συντεχνία Μας</a></li>
                <li><a href="discord.html">Discord Server</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">Περισσότερα <i class="fas fa-caret-down"></i></a>
                    <div class="dropdown-content">
                        <a href="gallery.php" class="active">Gallery</a>
                        <a href="guides.html">Οδηγοί / Builds</a>
                        <a href="events.html">Ημερολόγια Events</a>
                        <a href="recipes.html">Πάγκος Εργασίας</a>
                        <a href="politimoi-lithoi.html">Πολύτιμοι Λίθοι</a>
                    </div>
                </li>
            </ul>
            <div class="hamburger">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </header>

    <main class="hero-section gallery-mode">
        <h1 style="color: #FF6700; text-shadow: 2px 2px 4px #000;">Gallery</h1>

        <div class="upload-container">
            <h3>📸 Ανέβασε screenshot</h3>
            <form action="gallery.php" method="post" enctype="multipart/form-data">
                <input type="file" name="fileToUpload" id="fileToUpload" required style="color: #ccc;">
                <button type="submit" name="upload_image" class="btn-upload">Ανέβασμα</button>
            </form>
        </div>

        <hr style="border-color: #382D4A; margin: 30px 0; opacity: 0.5;">

        <div class="gallery-grid">
            <?php
            if (is_dir($folder_path)) {
                $images = glob($folder_path . "*.{jpg,jpeg,png,gif,webp}", GLOB_BRACE);
                if (count($images) > 0) {
                    foreach ($images as $image) {
                        echo '<div class="photo-card">';
                        echo '<a href="' . $image . '" target="_blank"><img src="' . $image . '"></a>';
                        
                        if ($isAdmin) {
                            echo '<form method="post" onsubmit="return confirm(\'Διαγραφή;\');">';
                            echo '<input type="hidden" name="delete_file" value="' . $image . '">';
                            echo '<button type="submit" class="delete-btn"><i class="fas fa-trash"></i></button>';
                            echo '</form>';
                        }
                        echo '</div>';
                    }
                } else {
                    echo '<p>Δεν υπάρχουν φωτογραφίες ακόμα.</p>';
                }
            }
            ?>
        </div>

        <div class="admin-controls">
            <?php if ($isAdmin): ?>
                <p style="color: lightgreen;">Admin Mode: ON</p>
                <form method="post"><button type="submit" name="logout" class="btn-logout">Έξοδος</button></form>
            <?php else: ?>
                <form method="post">
                    <input type="password" name="login_pass" placeholder="Κωδικός Admin..." class="admin-input">
                    <button type="submit" class="btn-login">Είσοδος</button>
                </form>
            <?php endif; ?>
        </div>
    </main>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 Νικηφόρος Καραπατάκης. All rights reserved.</p>
        </div>
    </footer>
    <script src="navbar.js"></script>
</body>
</html>