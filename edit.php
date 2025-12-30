<?php
require_once 'config.php';
$conn = connect_db();

$user = get_user_data($conn, $user_id);
if (!$user) {
    die("Utilisateur avec l'ID $user_id non trouvé.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $table = 'experiences';
    
    $item_id = (int)($_POST['item_id'] ?? 0);
    $name = mysqli_real_escape_string($conn, $_POST['name'] ?? '');
    $description = mysqli_real_escape_string($conn, $_POST['description'] ?? '');
    $startdate = mysqli_real_escape_string($conn, $_POST['startdate'] ?? '');
    $enddate = mysqli_real_escape_string($conn, $_POST['enddate'] ?? '');

    $message = "";

    try {
        if ($action === 'add') {
            $sql = "INSERT INTO $table (user_id, name, description, startdate, enddate) VALUES (?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "issss", $user_id, $name, $description, $startdate, $enddate);
            mysqli_stmt_execute($stmt);
            $message = "✅ Expérience ajoutée avec succès !";
        
        } elseif ($action === 'update' && $item_id > 0) {
            $sql = "UPDATE $table SET name=?, description=?, startdate=?, enddate=? WHERE id=? AND user_id=?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "ssssii", $name, $description, $startdate, $enddate, $item_id, $user_id);
            mysqli_stmt_execute($stmt);
            $message = "✅ Expérience mise à jour avec succès !";
            
        } elseif ($action === 'delete' && $item_id > 0) {
            $sql = "DELETE FROM $table WHERE id=? AND user_id=?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "ii", $item_id, $user_id);
            mysqli_stmt_execute($stmt);
            $message = "✅ Expérience supprimée avec succès !";
        }
        
        header("Location: edit.php?user_id=$user_id&msg=" . urlencode($message));
        exit();

    } catch (Exception $e) {
        $message = "❌ Erreur lors de l'opération : " . $e->getMessage();
        header("Location: edit.php?user_id=$user_id&msg=" . urlencode($message));
        exit();
    }
}

$experiences = get_section_data($conn, $user_id, 'experiences');
mysqli_close($conn);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Édition CV - <?php echo htmlspecialchars($user['firstname']); ?></title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
        <link rel="stylesheet" href="style.css">
    </head>
<body>

    <div class="main-container">
        
        <nav class="quick-nav">
            <a href="view.php?user_id=<?php echo $user_id; ?>" class="btn secondary-btn">
                <i class="fas fa-eye"></i> Mode Vue
            </a>
            <a href="#experience-add-form" class="btn secondary-btn btn-add">
                <i class="fas fa-plus"></i> Ajouter Expérience
            </a>
        </nav>
        
        <h1 style="text-align: center; color: #5AC8C5; margin-top: 40px;">ÉDITION DU CV de <?php echo htmlspecialchars($user['firstname'] . ' ' . $user['lastname']); ?></h1>
        
        <?php if (isset($_GET['msg'])): ?>
            <p style="text-align: center; padding: 10px; background-color: #d4edda; color: #155724; border-radius: 5px;"><?php echo htmlspecialchars($_GET['msg']); ?></p>
        <?php endif; ?>

        <section id="experience-add-form" class="edit-form-container">
            <h3 class="animated-rainbow-line">Ajouter une Expérience</h3>
            <form method="POST">
                <input type="hidden" name="action" value="add">
                <div class="form-group"><label>Titre:</label><input type="text" name="name" required></div>
                <div class="form-group"><label>Description:</label><textarea name="description"></textarea></div>
                <div class="form-group"><label>Date début:</label><input type="date" name="startdate" required></div>
                <div class="form-group"><label>Date fin:</label><input type="date" name="enddate"></div>
                <button type="submit" class="btn primary-btn btn-add"><i class="fas fa-plus"></i> Ajouter</button>
            </form>
        </section>

        <section class="edit-form-container">
            <h3 class="animated-rainbow-line">Modifier / Supprimer les Expériences Existantes</h3>
            
            <?php if (count($experiences) > 0): ?>
                <?php foreach ($experiences as $job): ?>
                <div class="crud-item">
                    <h4><?php echo htmlspecialchars($job['name']); ?></h4>
                    
                    <form method="POST">
                        <input type="hidden" name="item_id" value="<?php echo $job['id']; ?>">
                        
                        <div class="form-group"><label>Titre:</label><input type="text" name="name" value="<?php echo htmlspecialchars($job['name']); ?>" required></div>
                        <div class="form-group"><label>Description:</label><textarea name="description"><?php echo htmlspecialchars($job['description']); ?></textarea></div>
                        <div class="form-group"><label>Date début:</label><input type="date" name="startdate" value="<?php echo htmlspecialchars($job['startdate']); ?>" required></div>
                        <div class="form-group"><label>Date fin:</label><input type="date" name="enddate" value="<?php echo htmlspecialchars($job['enddate']); ?>"></div>
                        
                        <div class="crud-actions">
                            <button type="submit" name="action" value="update" class="btn-update"><i class="fas fa-save"></i> Modifier</button>
                            <button type="submit" name="action" value="delete" class="btn-delete" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?');"><i class="fas fa-trash"></i> Supprimer</button>
                        </div>
                    </form>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>Aucune expérience enregistrée. Utilisez le formulaire ci-dessus pour en ajouter une.</p>
            <?php endif; ?>
        </section>
        
    </div> 
    <script src="script.js"></script>
</body>
</html>