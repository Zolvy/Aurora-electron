let token =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNzE1OTcwNzA1LCJleHAiOjE3MjMyMjgzMDUsInJvb3RfaHR0cHNfb3JpZ2luIjpbImFwcGxlLmNvbSJdfQ.cAIuM4iKl00foeqabCEJplNDJa8M2lZFKOcwcFOGG4SCGT3sNG8n006hZE5BryJUcVij6HTpSjSbhzSQ-H1u6A";
document.addEventListener("musickitloaded", async function () {
  try {
    await MusicKit.configure({
      developerToken: token,
      app: {
        name: "My Cool Web App",
        build: "1978.4.1",
      },
    });
  } catch (err) {
    console.log("owo? MusicKit no workie :(");
  }
  const music = MusicKit.getInstance();
});
