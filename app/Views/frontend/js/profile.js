const user = getCurrentUser();

        if (user) {

            document.getElementById("welcome-text")
                .innerText = `Welcome Back, ${user.sub}`;

            document.getElementById("profile-avatar")
                .innerText = user.sub.charAt(0).toUpperCase();
        }
