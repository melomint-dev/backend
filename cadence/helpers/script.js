import * as fcl from "@onflow/fcl";

/**
 *
 * @param { code: string, args: Array<any> } script
 * @returns
 */

export const useScript = async (script) => {
  const response = await fcl.send([
    fcl.script(script.code),
    fcl.args(script.args),
  ]);
  const data = await fcl.decode(response);
  console.log(data);
  return data;
};
