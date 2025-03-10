document.addEventListener("DOMContentLoaded", function() {
    // 解析 URL 參數，取得 PDF 檔案路徑
    function getPdfUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("pdf");
    }

    var pdfUrl = getPdfUrl();
    if (!pdfUrl) {
        document.getElementById("pdfContainer").innerHTML = "❌ 無法載入 PDF";
        console.error("PDF URL 未提供");
        return;
    }

    var pdfjsLib = window["pdfjs-dist/build/pdf"];
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

    pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
        // 清空載入動畫 (移除 spinner)
        pdfContainer.classList.remove("spinner-border", "text-primary");
        document.getElementById("pdfContainer").innerHTML = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(function(page) {
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
        document.getElementById("pdfContainer").innerHTML = "❌ 無法載入 PDF";
        console.error("PDF 加載錯誤:", error);
    });

    // 禁止列印
    window.onbeforeprint = function() {
        document.body.innerHTML = "<h1>⚠️ 禁止列印！</h1>";
        setTimeout(function() {
            location.reload();
        }, 2000);
    };
});