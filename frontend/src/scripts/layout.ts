export async function loadComponent(
  componentId: string,
  filePath: string
): Promise<void> {
  try {
    const response = await fetch(filePath);
    // console.log(response);
    

    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}`);
    }

    const html = await response.text();
    // console.log(html);
    

    const container = document.getElementById(componentId);

    if (container) {
      container.innerHTML = html;
    }
  } catch (error) {
    console.error("Error loading component:", error);
  }
}
