(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos,
            behavior: 'smooth'
        })
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        select('body').classList.toggle('mobile-nav-active')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let body = select('body')
            if (body.classList.contains('mobile-nav-active')) {
                body.classList.remove('mobile-nav-active')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });

    /**
     * Hero type effect
     */
    const typed = select('.typed')
    if (typed) {
        let typed_strings = typed.getAttribute('data-typed-items')
        typed_strings = typed_strings.split(',')
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000
        });
    }

    /**
     * Skills animation
     */
    let skilsContent = select('.skills-content');
    if (skilsContent) {
        new Waypoint({
            element: skilsContent,
            offset: '80%',
            handler: function(direction) {
                let progress = select('.progress .progress-bar', true);
                progress.forEach((el) => {
                    el.style.width = el.getAttribute('aria-valuenow') + '%'
                });
            }
        })
    }

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
        let projectContainer = select('.project-container');
        if (projectContainer) {
            let projectIsotope = new Isotope(projectContainer, {
                itemSelector: '.project-item'
            });

            let projectFilters = select('#project-flters li', true);

            on('click', '#project-flters li', function(e) {
                e.preventDefault();
                projectFilters.forEach(function(el) {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                projectIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
                projectIsotope.on('arrangeComplete', function() {
                    AOS.refresh()
                });
            }, true);
        }

    });

    /**
     * Initiate project lightbox 
     */
    const projectLightbox = GLightbox({
        selector: '.project-lightbox'
    });

    /**
     * project details slider
     */
    new Swiper('.project-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        }
    });

    /**
     * Testimonials slider
     */
    new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },

            1200: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });

    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        })
    });


    /**
     * Google Form
     */

    document.getElementById("google-form").addEventListener("submit", function(e) {
        e.preventDefault(); // 停止表單默認提交

        // 顯示加載訊息
        document.querySelector(".loading").style.display = "block";

        // 發送表單資料到 Google Apps Script Web App URL
        fetch("https://script.google.com/macros/s/AKfycbyZ9u4lBMbeEcuGZiMos1_GojnG0Jwu30MPbUV35yPLXecnz3mIsb4m2N0r-QANcZUsjg/exec", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    subject: document.getElementById("subject").value,
                    message: document.getElementById("message").value
                })
            })
            .then(response => response.text())
            .then(text => {
                // 隱藏加載訊息
                document.querySelector(".loading").style.display = "none";

                // 如果回應為"Success"，顯示成功訊息
                if (text.trim() === "Success") {
                    document.querySelector(".sent-message").style.display = "block"; // 顯示成功訊息
                    document.getElementById("google-form").reset();
                } else {
                    // 顯示錯誤訊息
                    document.querySelector(".error-message").style.display = "block";
                    document.querySelector(".error-message").innerHTML = text; // 顯示錯誤內容
                }
            })
            .catch(error => {
                console.error(error);
                // 隱藏加載訊息並顯示錯誤訊息
                document.querySelector(".loading").style.display = "none";
                document.querySelector(".error-message").style.display = "block";
                document.querySelector(".error-message").innerHTML = "提交錯誤，請檢查網路連線！"; // 顯示通用錯誤訊息
            });
    });


    // 禁止右鍵、長按、開發者工具、列印、截圖
    function disableActions() {
        // 禁止右鍵（電腦）
        document.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });

        // 禁止長按（手機、平板）
        document.addEventListener("touchstart", function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        // 禁止快捷鍵（Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+Shift+I, F12）
        document.addEventListener("keydown", function(event) {
            if (
                event.ctrlKey && ["s", "S", "p", "P", "u", "U", "i", "I", "j", "J", "c", "C"].includes(event.key)
            ) {
                event.preventDefault();
            }
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
                event.preventDefault();
            }
            if (event.key === "PrintScreen") {
                document.body.innerHTML = "<h1>⚠️ 禁止截圖！</h1>";
            }
        });

        // 禁止列印
        window.onbeforeprint = function() {
            document.body.innerHTML = "<h1>⚠️ 禁止列印！</h1>";
            setTimeout(function() {
                location.reload();
            }, 2000);
        };

        // 偵測開發者工具（手機 & 電腦）
        setInterval(function() {
            if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                document.body.innerHTML = "<h1>⚠️ 開發者工具已啟用，請關閉後重新整理。</h1>";
            }
        }, 1000);
    }

    // 當用戶點擊 PDF 連結時，開啟新分頁並顯示 PDF
    document.querySelectorAll(".pdf-link").forEach(function(link) {
        link.addEventListener("click", function() {
            var pdfUrl = link.getAttribute("data-pdf"); // 取得 PDF 路徑
            var pdfWindow = window.open("", "_blank"); // 在新分頁開啟 PDF

            if (pdfWindow) {
                pdfWindow.document.write(`
                <html>
                <head>
                    <title>PDF 檢視器（禁止下載、列印、截圖）</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
                    <style>
                        body { margin: 0; text-align: center; font-family: Arial, sans-serif; background-color: black; }
                        canvas { display: block; margin: 10px auto; border: 1px solid #ccc; pointer-events: none; }
                        .overlay { 
                            position: absolute; 
                            top: 0; left: 0; width: 100%; height: 100%; 
                            background: rgba(0, 0, 0, 0.2); 
                            z-index: 1000; 
                        }
                        @media print {
                            body * { display: none !important; }
                            body::after { content: "⚠️ 禁止列印"; font-size: 50px; color: red; display: block; text-align: center; }
                        }
                    </style>
                </head>
                <body>
                    <h3>PDF 檢視器（禁止下載、列印、截圖）</h3>
                    <div id="pdfContainer">🔄 正在載入 PDF...</div>
                    <div class="overlay"></div>

                    <script>
                        var url = "${pdfUrl}";
                        var pdfjsLib = window["pdfjs-dist/build/pdf"];
                        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

                        pdfjsLib.getDocument(url).promise.then(function (pdf) {
                            document.getElementById("pdfContainer").innerHTML = ""; // 清空載入字樣
                            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                                pdf.getPage(pageNum).then(function (page) {
                                    var scale = 1.5;
                                    var viewport = page.getViewport({ scale: scale });

                                    var canvas = document.createElement("canvas");
                                    var context = canvas.getContext("2d");
                                    canvas.width = viewport.width;
                                    canvas.height = viewport.height;

                                    var renderContext = {
                                        canvasContext: context,
                                        viewport: viewport
                                    };

                                    document.getElementById("pdfContainer").appendChild(canvas);
                                    page.render(renderContext);
                                });
                            }
                        }).catch(function(error) {
                            document.getElementById("pdfContainer").innerHTML = "❌ 無法載入 PDF，請檢查檔案路徑！";
                            console.error("PDF 加載錯誤:", error);
                        });

                        // 禁止列印
                        window.onbeforeprint = function() {
                            document.body.innerHTML = "<h1>⚠️ 禁止列印！</h1>";
                            setTimeout(function() {
                                location.reload();
                            }, 2000);
                        };

                        // 禁止開發者工具
                        setInterval(function() {
                            if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                                document.body.innerHTML = "<h1>⚠️ 禁止開發者工具</h1>";
                            }
                        }, 1000);
                    <\/script>
                </body>
                </html>
            `);
            } else {
                alert("彈出視窗被瀏覽器阻擋，請允許彈出視窗！");
            }
        });
    });




})()






function toggleDescription(element) {
    // 點擊時切換 class
    element.classList.toggle("active");
}