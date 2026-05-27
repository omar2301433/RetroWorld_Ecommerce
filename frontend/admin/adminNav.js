

const AdminSidebar = `
<aside class="sidebar">

        <nav class="sidebar-nav">
          <a href="../admin/dashboard.html" data-page="dashboard" class="sidebar-link">
            <span>📊</span>
            Dashboard
          </a>

          <a href="../admin/users.html" class="sidebar-link">
            <span>👥</span>
            User Management
          </a>

          <a href="../admin/ManageCategories.html" class="sidebar-link">
            <span>📦</span>
            Categories
          </a>
          <a href="../admin/ManageProducts.html" class="sidebar-link">
                <span>🛒</span>
                Products
            </a>
            <a href="../admin/ManageBrands.html" class="sidebar-link">
                <span>🏷️</span>
                Brands
            </a>
            <a href="../admin/ManageBundles.html" class="sidebar-link">
                <span>📦</span>
                Bundles
            </a>
        </nav>

      </aside>
`;

document.getElementById("sidebar-container").innerHTML = AdminSidebar;
 
 
  