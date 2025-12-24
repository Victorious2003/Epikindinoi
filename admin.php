<?php
session_start();
require 'db_connect.php'; // Σύνδεση

$admin_pass = "dso1234"; // <--- ΑΛΛΑΞΕ ΚΩΔΙΚΟ

// LOGIN
if (isset($_POST['login'])) {
    if ($_POST['password'] === $admin_pass) {
        $_SESSION['admin'] = true;
    }
}

// LOGOUT
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: gallery.php");
    exit;
}

// DELETE
if (isset($_GET['delete']) && isset($_SESSION['admin'])) {
    $id = intval($_GET['delete']);
    
    // 1. Βρες το αρχείο
    $q = $conn->query("SELECT image_url FROM gallery_images WHERE id=$id");
    if ($row = $q->fetch_assoc()) {
        $file = $row['image_url'];
        // 2. Σβήσε το αρχείο από το φάκελο
        if (file_exists($file)) { unlink($file); }
    }
    
    // 3. Σβήσε από SQL
    $conn->query("DELETE FROM gallery_images WHERE id=$id");
    header("Location: admin.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin</title>
    <link rel="stylesheet" href="style.css"> <style>
        .row { display: flex; align-items: center; background: #2a2a2a; margin: 10px auto; padding: 10px; max-width: 600px; border-radius: 5px; }
        .row img { width: 50px; height: 50px; object-fit: cover; margin-right: 20px; border-radius: 4px; }
        .del-btn { background: #d32f2f; margin-left: auto; padding: 5px 15px; text-decoration: none; color: white; border-radius: 4px; font-size: 14px;}
        input[type="password"] { width: 200px; padding: 10px; }
    </style>
</head>
<body>
    <h2>Admin Panel</h2>

    <?php if (!isset($_SESSION['admin'])): ?>
        <form method="post" style="margin-top:50px;">
            <input type="password" name="password" placeholder="Κωδικός" required>
            <button type="submit" name="login">Είσοδος</button>
        </form>
        <br><a href="gallery.php" style="color:#aaa;">Πίσω</a>
    <?php else: ?>
        <a href="?logout=true" style="color:#ff8c00;">Αποσύνδεση</a> | <a href="gallery.php" style="color:#aaa;">Δες το Gallery</a>
        <br><br>
        
        <?php
        $res = $conn->query("SELECT * FROM gallery_images ORDER BY id DESC");
        while($row = $res->fetch_assoc()):
        ?>
            <div class="row">
                <img src="<?= $row['image_url'] ?>">
                <div style="text-align:left;">
                    <div style="color:#ff8c00; font-weight:bold;"><?= $row['submitter_name'] ?></div>
                    <div style="font-size:12px; color:#777;"><?= $row['id'] ?></div>
                </div>
                <a href="?delete=<?= $row['id'] ?>" class="del-btn" onclick="return confirm('Σίγουρα;')">X</a>
            </div>
        <?php endwhile; ?>
    <?php endif; ?>
</body>
</html>