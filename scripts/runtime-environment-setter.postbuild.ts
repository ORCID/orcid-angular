import { runtimeEnvironmentScript } from "./utils";

/**
 * Receives an HTML string, replaces the [ENVIRONMENT_VARAIBLES_PLACEHOLDER]
 * with a <script> that sets window.environment at runtime,
 * and returns the modified HTML string.
 */
export function replaceEnvPlaceholder(htmlContent: string): string {
  // 1. Build the script that runs in the browser


  // 2. Wrap the content in a <script> tag
  const scriptTag = `<script>${runtimeEnvironmentScript()}</script>`;

  // 3. Replace the placeholder in the HTML
  const placeholderBlockRegex = /<!-- ENV_SCRIPT_PLACEHOLDER -->([\s\S]*?)<!-- \/ENV_SCRIPT_PLACEHOLDER -->/;

  const updatedHtml = htmlContent.replace(placeholderBlockRegex, scriptTag);

  // 4. Return the updated HTML
  return updatedHtml;
}