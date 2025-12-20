const navContainer = document.getElementById("nav-container");

navContainer.innerHTML = `
<nav style="
    /* CONTENEDOR DEL NAV */
#nav-container {
    position: relative;
    z-index: 1000;
}

/* NAV */
.main-nav {
    width: 100%;
    height: 120px;
    background-color: #000; /* negro real */
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    box-sizing: border-box;
}

/* LOGO */
.nav-logo {
    height: 80%;
    max-height: 100px;
    width: auto;
    object-fit: contain;
}

/* MOBILE */
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
         alt="Logo"
         style="
            height: 400px;  /* LOGO más grande */
            object-fit: contain;
            cursor: pointer;
         ">
</nav>
`;
