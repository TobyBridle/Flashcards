<!DOCTYPE html>
  <html>
  <head>
  <title>Flashcards.IO | Auth</title>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp" crossorigin="anonymous">
  <link rel="stylesheet" href="./styles.css">
    <script type="text/javascript" src="./app.js"></script>

  <body> 
    <main>
  <div class="container">
    <h1>Sign Up</h1>
    <form action="/" method="POST">
      <input type="text" maxlength="25" placeholder="Username" required />
      <p class="username-error"></p>
      <input type="password" placeholder="Password" required />
      <p class="password-error"></p>
      <button type="submit">Sign In</button>
      <p class="no-account tosign-in">Already have an Account? <a>Sign In</a></p>
    </form>
    
  </div>
  
  <div class="container" style="display:none">
    <h1>Sign In</h1>
    <form action="/" method="POST">
      <input type="text" maxlength="25" placeholder="Username" required />
      <p class="username-error"></p>
      <input type="password" placeholder="Password" required />
      <p class="password-error"></p>
      <button type="submit">Sign In</button>
      <p class="no-account tosign-up">Don't Have an Account? <a>Sign up</a></p>
    </form>
    
  </div>
</main>
    </body>
    </html>
