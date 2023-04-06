// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");
const axios = require("axios");
type HeaderKey = "cookie" | "Authorization";
type HeaderType = {
  [key in HeaderKey]?: string;
};
interface ConfigType {
  url: string;
  headers: HeaderType;
  path: string[];
  fileName: string;
}
const genSnippets = async (
  path: string | undefined,
  headers: HeaderType | undefined,
  plugin?: () => {}
): Promise<any> => {
  try {
    const result = await axios.get(path, {
      headers: {
        ...headers,
      },
    });
    return result.data;
  } catch (error) {
    return "";
  }
};

const getConfig = (): ConfigType | null => {
  try {
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
    const configPath = path.join(rootPath, "octo.json");
    const data = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};
const genCode = (codeString: string) => {
  const regex = /\/\/(.*)/;
  const match = codeString.match(regex) || [];

  const prefix = match[1].trim();
  const body = codeString.replace(regex, "").trim();
  return {
    prefix,
    body,
    description: "",
  };
};

const saveSnippet = (snippetFilePath: string, snippetConfig: any) => {
  try {
    // const tm = vscode.window.terminals[0];
    // tm.sendText(JSON.stringify(snippetConfig));
    fs.writeFileSync(
      `${snippetFilePath}.code-snippets`,
      JSON.stringify(snippetConfig, null, 2)
    );
    vscode.window.showInformationMessage(`拉取成功`);
  } catch (error) {
    // const tm = vscode.window.terminals[0];
    // tm.sendText(JSON.stringify(error));
    vscode.window.showInformationMessage(`拉取失败！！！`);
  }
};
const checkSnippet = () => {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
  const snippetsFilePath = path.join(root, ".vscode");
  if (!fs.existsSync(snippetsFilePath)) {
    // 如果文件不存在，则创建一个新的文件
    fs.mkdirSync(path.join(root, ".vscode", "snippets"), { recursive: true });
    console.log("Snippets file created successfully!");
  } else {
    console.log("Snippets file already exists.");
  }
};
export async function activate(context: vscode.ExtensionContext) {
  // 读取workspace的配置
  let config = getConfig();

  let disposable = vscode.commands.registerCommand(
    "octofragment.helloWorld",
    async () => {
      const snippetConfig: {
        snippets: { [key: string]: { [key: string]: string } };
      } = {
        snippets: {},
      };
      if (!config) {
        vscode.window.showInformationMessage(`请检查本地的配置！！！`);
        return;
      }
      checkSnippet();
      const task = config.path.map((p: any) =>
        genSnippets(`${config?.url}${p}`, config?.headers)
      );
      const resList = await Promise.all(task);
      const resu = resList
        .filter((r) => r)
        .forEach((r) => {
          const sni = genCode(r);
          snippetConfig.snippets[sni.prefix] = {
            prefix: sni.prefix,
            body: sni.body,
          };
        });
      const snippetFilePath = path.join(
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "",
        ".vscode",
        config.fileName || "default_octo_snippets"
      );
      saveSnippet(snippetFilePath, snippetConfig);
      vscode.window.showInformationMessage(`拉取片段...ING `);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
