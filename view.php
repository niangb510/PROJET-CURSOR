<?php
// Fichier : view.php
// Affiche le CV dynamique de l'utilisateur sélectionné

// 1. Inclure la configuration et les fonctions de BDD (Définit $user_id, et les fonctions)
require_once 'config.php';

// 2. Établir la connexion (Ceci doit se faire APRÈS l'inclusion, et définit $conn)
$conn = connect_db(); 

$user = get_user_data($conn, $user_id);
if (!$user) {
    die("Utilisateur avec l'ID $user_id non trouvé.");
}

$experiences = get_section_data($conn, $user_id, 'experiences');
$educations = get_section_data($conn, $user_id, 'educations');
$skills = get_section_data($conn, $user_id, 'skills');

// 4. FERMER LA CONNEXION
mysqli_close($conn);

// --- DÉBUT DE LA PARTIE HTML/FRONTEND ---
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo htmlspecialchars($user['firstname'] . ' ' . $user['lastname']); ?> - CV Dynamique</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
        <link rel="stylesheet" href="style.css">
    </head>
<body>

    <button id="dark-mode-toggle" class="btn dark-mode-toggle-btn" title="Toggle dark mode">
        <i class="fas fa-moon"></i> 
    </button>
    
    <div class="main-container">
        
        <!-- HEADER / PROFIL -->
        <header class="profile-section">
            <div class="profile-content">
                <div class="profile-image-container">
                    <img src="<?php echo htmlspecialchars($user['picture']); ?>" alt="Profile Picture" class="profile-image">
                </div>
                <div class="profile-details">
                    <h1><?php echo htmlspecialchars($user['firstname'] . ' ' . $user['lastname']); ?></h1>
                    <h2>Computer Science Student at Epitech Moulins</h2>
                </div>
            </div>
        </header>

        <!-- NAVIGATION -->
        <nav class="quick-nav">
            <a href="#experience" class="btn secondary-btn">Experience</a>
            <a href="#education" class="btn secondary-btn">Education</a>
            <a href="#skills" class="btn secondary-btn">Skills</a>
            <a href="edit.php?user_id=<?php echo $user_id; ?>" class="btn primary-btn" style="margin-left: 20px;">
                <i class="fas fa-edit"></i> MODE ÉDITION
            </a>
        </nav>

        <!-- 1. SECTION EXPERIENCE (Dynamique) -->
        <section class="experience-section tab-content" id="experience">
            <h3 class="animated-rainbow-line">Professional Experience 
                <button class="toggle-btn" data-target="experience-list"><i class="fas fa-minus-circle"></i></button>
            </h3>
            
            <div id="experience-list" class="content-list">
            <?php if (count($experiences) > 0): ?>
                <?php foreach ($experiences as $job): ?>
                <article class="job-entry">
                    <h4><?php echo htmlspecialchars($job['name']); ?></h4>
                    <p class="details">
                        <?php echo htmlspecialchars($job['startdate']) . ' to ' . htmlspecialchars($job['enddate']); ?> | <?php echo htmlspecialchars($job['description'] ?? ''); ?>
                    </p>
                </article>
                <?php endforeach; ?>
            <?php else: ?>
                <p>Aucune expérience professionnelle enregistrée.</p>
            <?php endif; ?>
            </div>
        </section>

        <!-- 2. SECTION EDUCATION (Dynamique) -->
        <section class="education-section tab-content" id="education">
            <h3 class="animated-rainbow-line">Degrees and Training
                <button class="toggle-btn" data-target="education-list"><i class="fas fa-minus-circle"></i></button>
            </h3>
            
            <div id="education-list" class="content-list">
            <?php if (count($educations) > 0): ?>
                <?php foreach ($educations as $degree): ?>
                <article class="degree-entry">
                    <h4><?php echo htmlspecialchars($degree['name']); ?></h4>
                    <p class="details">
                        <?php echo htmlspecialchars($degree['startdate']) . ' to ' . htmlspecialchars($degree['enddate']); ?> | <?php echo htmlspecialchars($degree['description'] ?? ''); ?>
                    </p>
                </article>
                <?php endforeach; ?>
            <?php else: ?>
                <p>Aucun diplôme ou formation enregistré.</p>
            <?php endif; ?>
            </div>
        </section>
        
        <!-- 3. SECTION SKILLS (Dynamique) -->
        <section class="skills-section tab-content" id="skills">
            <h3 class="animated-rainbow-line">Skills and Strengths
                <button class="toggle-btn" data-target="skills-list"><i class="fas fa-minus-circle"></i></button>
            </h3>
            
            <div id="skills-list" class="content-list">
                <div class="skill-category">
                    <h4>Compétences Techniques et Personnelles</h4>
                    <ul>
                    <?php if (count($skills) > 0): ?>
                        <?php foreach ($skills as $skill): ?>
                        <li><?php echo htmlspecialchars($skill['name']); ?> (Level: <?php echo htmlspecialchars($skill['level']); ?>)</li>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <li>Aucune compétence enregistrée.</li>
                    <?php endif; ?>
                    </ul>
                </div>
            </div>
        </section>
        
        <!-- 4. SECTION CONTACT (Mailto exigé par le PDF) -->
        <section class="info-personnelles-section tab-content" id="info-personnelles">
            <h3 class="animated-rainbow-line">Personal Information and Contact</h3>
            <div class="contact-details-box">
                <h4>Contact Information</h4>
                <p><strong>Phone:</strong> <?php echo htmlspecialchars($user['phone']); ?></p>
                <p><strong>Email:</strong> <a href="mailto:<?php echo htmlspecialchars($user['email']); ?>"><?php echo htmlspecialchars($user['email']); ?></a></p>
            </div>
        </section>
        
    </div> 
    <script src="script.js"></script>
</body>

</html>