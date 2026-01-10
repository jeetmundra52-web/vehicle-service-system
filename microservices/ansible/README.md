# How to Deploy with Ansible

Ansible is a Linux-based automation tool. Since you are on Windows, you have two options to run this:
1.  **Use WSL (Windows Subsystem for Linux)**: Recommended.
2.  **Use a Linux Virtual Machine**.

## Prerequisites
1.  **Ansible Installed**:
    ```bash
    sudo apt update
    sudo apt install ansible -y
    ```
2.  **SSH Access**: You must have SSH access to the target server defined in `inventory.ini`.

## Configuration
1.  Open `inventory.ini`.
2.  Replace the placeholder with your target server's IP address.
    ```ini
    [webservers]
    192.168.1.50 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
    ```

## Execution Command
Run the following command from this directory:

```bash
ansible-playbook -i inventory.ini deploy.yml
```

## What will happen?
1.  Ansible connects to the server.
2.  Installs Docker & Docker Compose.
3.  Copies your microservices code.
4.  Builds and starts the containers.
