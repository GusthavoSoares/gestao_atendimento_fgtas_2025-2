(function(){
  window.togglePasswordVisibility = function(inputId, btn){
    var input = document.getElementById(inputId);
    if(!input) return;
    var isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if(btn){
      var icon = btn.querySelector('i');
      if(icon){
        icon.className = 'fas fa-' + (isPassword ? 'eye-slash' : 'eye');
      }
    }
  };
})();