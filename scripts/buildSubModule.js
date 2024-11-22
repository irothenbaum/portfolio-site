async function buildSubModule(moduleName) {
  console.log(`Building sub-module ${moduleName}...`)

  execSync(`cd ${moduleName} && npm run build`, {
    stdio: 'inherit',
  })

  console.log(`Finished building sub-module ${moduleName}`)
}

export default buildSubModule
