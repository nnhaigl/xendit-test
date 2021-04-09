export function loadPackage(
  packageName: string,
  context: string,
  loaderFn?: () => void,
) {
  try {
    return loaderFn ? loaderFn() : require(packageName)
  } catch (e) {
    console.log("eeeeeee",e)
    process.exit(1)
  }
}
