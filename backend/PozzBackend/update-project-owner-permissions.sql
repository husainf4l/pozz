-- Add Projects permissions to ProjectOwner role
-- This script adds the missing permissions to existing ProjectOwner roles

-- Get the ProjectOwner role ID and Projects permission IDs
WITH project_owner_role AS (
    SELECT "Id" FROM roles WHERE "Name" = 'ProjectOwner' LIMIT 1
),
projects_permissions AS (
    SELECT "Id", "Name" FROM permissions 
    WHERE "Name" IN ('projects.read', 'projects.create', 'projects.update', 'projects.delete')
)
-- Insert role_permissions if they don't exist
INSERT INTO role_permissions ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM project_owner_role r
CROSS JOIN projects_permissions p
WHERE NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp."RoleId" = r."Id" AND rp."PermissionId" = p."Id"
);

-- Verify the result
SELECT r."Name" as role_name, p."Name" as permission_name 
FROM roles r
JOIN role_permissions rp ON r."Id" = rp."RoleId"
JOIN permissions p ON rp."PermissionId" = p."Id"
WHERE r."Name" = 'ProjectOwner'
ORDER BY p."Name";
