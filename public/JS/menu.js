const navContainer = document.getElementById("nav-container");

navContainer.innerHTML = `
<nav style="
    /* NAV */
.main-nav {
    width: 100%;
    height: 120px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    box-sizing: border-box;
}

/* LOGO RESPONSIVE */
.nav-logo {
    height: 100%;          /* se adapta al nav */
    max-height: 100px;     /* límite visual */
    width: auto;           /* mantiene proporción */
    object-fit: contain;
    cursor: pointer;
}

/* TABLET */
@media (max-width: 768px) {
    .main-nav {
        height: 80px;
        padding-left: 12px;
    }

    .nav-logo {
        max-height: 60px;
    }
}

/* MOBILE CHICO */
@media (max-width: 480px) {
    .main-nav {
        height: 70px;
    }

    .nav-logo {
        max-height: 50px;
    }
}

">
    <img src="../fotos/Logo franco op 2 final.png" 
         alt="Logo">
</nav>
`;



// navContainer.innerHTML = `
// <nav style="
//     width: 100%;
//     height: 120px;
//     background: #000000ff;
//     display: flex;
//     align-items: center;
//     justify-content: flex-start;
//     padding-left: 20px;
//     margin: 0;           /* Pegado arriba */
//     box-sizing: border-box;
// ">
//     <img src="../fotos/Logo franco op 2 final.png" 
//          alt="Logo"
//          style="
//             height: 400px;  /* LOGO más grande */
//             object-fit: contain;
//             cursor: pointer;
//          ">
// </nav>
// `;