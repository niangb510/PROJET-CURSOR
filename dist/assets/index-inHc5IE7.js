(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();const d=[{id:1,title:"Site Web pour Agent de Football",description:"Site vitrine complet avec gestion de formulaires et présentation de joueurs.",image:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",tags:["HTML5","CSS3","JavaScript"],rncp:"Développer une interface utilisateur",analysis:{progression:"Maîtrise de la structure sémantique et du responsive design.",errors:"Difficultés initiales avec la validation des formulaires côté client.",solutions:"Implémentation de Regex personnalisées et de retours visuels immédiats."}},{id:2,title:"Application To-Do List",description:"Gestionnaire de tâches avec persistance locale et filtrage dynamique.",image:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",tags:["JavaScript","Local Storage","DOM Manipulation"],rncp:"Concevoir une application web",analysis:{progression:"Compréhension profonde de la manipulation du DOM et du cycle de vie des données.",errors:"Gestion complexe des états lors du filtrage.",solutions:"Refactorisation vers une approche basée sur les données (Data-driven)."}},{id:3,title:"Portfolio RNCP",description:"Ce portfolio hybride conçu pour la validation du titre Epitech.",image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",tags:["Vite","Sass","BEM"],rncp:"Démarche DevOps & Qualité",analysis:{progression:"Utilisation d'un workflow moderne (Vite, Sass) et méthodologie BEM.",errors:"Architecture CSS initiale trop monolithique.",solutions:"Découpage en modules SCSS pour une meilleure maintenance."}}],r=document.getElementById("view-toggle"),u=document.getElementById("showcase-view"),p=document.getElementById("pedagogical-view"),l=document.getElementById("theme-toggle"),m=document.getElementById("projects-container"),g=document.getElementById("pedagogical-list"),c=document.getElementById("contact-form");function f(){m.innerHTML=d.map(e=>`
        <article class="project-card">
            <img src="${e.image}" alt="${e.title}" class="project-card__image">
            <div class="project-card__content">
                <span class="project-card__rncp">${e.rncp}</span>
                <h3 class="project-card__title">${e.title}</h3>
                <p class="project-card__description">${e.description}</p>
                <div class="project-card__tags">
                    ${e.tags.map(t=>`<span class="tag">${t}</span>`).join("")}
                </div>
                <button class="btn btn--secondary btn--small" onclick="document.getElementById('view-toggle').click()">Détails RNCP</button>
            </div>
        </article>
    `).join(""),g.innerHTML=d.map(e=>`
        <div class="pedagogical-item">
            <div class="pedagogical-item__header">
                <h3>${e.title}</h3>
                <span class="tag">${e.rncp}</span>
            </div>
            <div class="pedagogical-item__analysis">
                <div class="pedagogical-item__block">
                    <h4>Progression & Compétences</h4>
                    <p>${e.analysis.progression}</p>
                </div>
                <div class="pedagogical-item__block">
                    <h4>Erreurs & Solutions</h4>
                    <p><strong>Problème :</strong> ${e.analysis.errors}</p>
                    <p><strong>Solution :</strong> ${e.analysis.solutions}</p>
                </div>
            </div>
        </div>
    `).join("")}r.addEventListener("click",()=>{const t=r.getAttribute("data-view")==="showcase"?"pedagogical":"showcase";r.setAttribute("data-view",t),r.querySelectorAll(".view-toggle__label").forEach(a=>{a.getAttribute("data-view")===t?a.classList.add("view-toggle__label--active"):a.classList.remove("view-toggle__label--active")}),t==="pedagogical"?(u.classList.add("hidden"),p.classList.remove("hidden")):(u.classList.remove("hidden"),p.classList.add("hidden"))});l.addEventListener("click",()=>{document.body.classList.toggle("dark-mode");const e=l.querySelector("i");document.body.classList.contains("dark-mode")?e.classList.replace("fa-moon","fa-sun"):e.classList.replace("fa-sun","fa-moon")});c.addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("form-status"),i=c.querySelector('button[type="submit"]'),a=new FormData(e.target);i.disabled=!0,i.textContent="Envoi en cours...";try{const s=await fetch(e.target.action,{method:c.method,body:a,headers:{Accept:"application/json"}});if(s.ok)t.innerHTML="Merci ! Votre message a été envoyé avec succès.",t.classList.remove("hidden","error"),t.classList.add("success"),c.reset();else{const o=await s.json();Object.hasOwn(o,"errors")?t.innerHTML=o.errors.map(n=>n.message).join(", "):t.innerHTML="Oups ! Un problème est survenu lors de l'envoi.",t.classList.remove("hidden","success"),t.classList.add("error")}}catch{t.innerHTML="Oups ! Impossible de contacter le serveur.",t.classList.remove("hidden","success"),t.classList.add("error")}finally{i.disabled=!1,i.textContent="Envoyer"}});function v(){const e=document.querySelectorAll(".reveal"),t=new IntersectionObserver(i=>{i.forEach(a=>{a.isIntersecting&&a.target.classList.add("active")})},{threshold:.15});e.forEach(i=>t.observe(i))}document.addEventListener("DOMContentLoaded",()=>{f(),v(),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.body.classList.add("dark-mode"),l.querySelector("i").classList.replace("fa-moon","fa-sun"))});
