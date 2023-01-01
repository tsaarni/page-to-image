import express from "express";
import puppeteer from "puppeteer";
import sharp from "sharp";

const app = express();
const port = 3000;

app.get("/snap", (req, res) => {
  puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage();

    // blur image?
    // https://github.com/puppeteer/puppeteer/issues/571
    await page.setViewport({
      width: 1200,
      height: 825,
      deviceScaleFactor: 1,
    });

    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });
    await page.screenshot({ type: "png" }).then(async (img) => {
      const buf = await sharp(img).withMetadata({ density: 72 }).toBuffer();
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buf.length,
      });
      res.write(buf);
      res.end();
    });
    await browser.close();
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
