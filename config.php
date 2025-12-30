<?php

define('DB_HOST', 'db');
define('DB_USER', 'user_webpool');
define('DB_PASS', 'user_password');
define('DB_NAME', 'webpool_db');

function connect_db() {
    $conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if (!$conn) {
        die("Erreur de connexion à la base de données : " . mysqli_connect_error());
    }
    
    mysqli_set_charset($conn, "utf8mb4");
    
    return $conn;
}

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 1;

if ($user_id <= 0) {
    die("ID utilisateur invalide.");
}

function get_user_data($conn, $user_id) {
    $sql = "SELECT * FROM users WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($result);
}

function get_section_data($conn, $user_id, $table) {
    $order_clause = ($table === 'experiences' || $table === 'educations') 
        ? "ORDER BY startdate DESC" 
        : "ORDER BY name ASC"; 
    
    $sql = "SELECT * FROM $table WHERE user_id = ? $order_clause";
    
    $stmt = mysqli_prepare($conn, $sql);
    if ($stmt === false) {
        error_log("Erreur SQL lors de la préparation : " . mysqli_error($conn));
        return [];
    }
    
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}
