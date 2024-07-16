document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchValue = document.getElementById('search').value.trim();
      
      if (searchValue) {
        try {
          // Clear previous results
          userList.innerHTML = '';
          reposList.innerHTML = '';
  
          // Search users
          const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchValue}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
  
          if (!usersResponse.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const usersData = await usersResponse.json();
  
          // Display users
          usersData.items.forEach(user => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
              <div>
                <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px; border-radius: 50%;">
                <span>${user.login}</span>
                <a href="${user.html_url}" target="_blank">Profile</a>
              </div>
            `;
            userItem.addEventListener('click', async () => {
              // Fetch user repos
              const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                headers: {
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
  
              if (!reposResponse.ok) {
                throw new Error('Failed to fetch repos data');
              }
  
              const reposData = await reposResponse.json();
  
              // Display repos
              reposList.innerHTML = '';
              reposData.forEach(repo => {
                const repoItem = document.createElement('li');
                repoItem.textContent = repo.name;
                reposList.appendChild(repoItem);
              });
            });
  
            userList.appendChild(userItem);
          });
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    });
  });