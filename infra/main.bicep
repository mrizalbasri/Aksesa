targetScope = 'resourceGroup'

@description('Environment name used as suffix for resource naming.')
param environmentName string = 'dev'

@description('Primary Azure region for all resources.')
param location string = resourceGroup().location

@description('Microsoft Entra object id for SQL administrator principal.')
param principalId string

@description('Microsoft Entra display name for SQL administrator principal.')
param principalName string

@description('SQL database name for application data.')
param sqlDatabaseName string = 'Aksesa_db'

@description('Base tags applied to all resources.')
param tags object = {}

var nameBase = toLower('aksesa${environmentName}${uniqueString(subscription().id, resourceGroup().id, environmentName)}')
var appServicePlanName = '${nameBase}-plan'
var webServiceName = 'web'
var apiServiceName = 'api'
var webAppName = '${nameBase}-web'
var apiAppName = '${nameBase}-api'
var appServiceHostSuffix = 'azurewebsites.net'
var webHostName = '${webAppName}.${appServiceHostSuffix}'
var apiHostName = '${apiAppName}.${appServiceHostSuffix}'
var appInsightsName = '${nameBase}-appi'
var sqlServerName = '${nameBase}-sql'
var storageAccountName = substring(replace('${nameBase}st', '-', ''), 0, 24)
var storageContainerName = 'documents'
var openAiName = '${nameBase}-oai'
var docIntelName = '${nameBase}-doc'

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: null
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
    accessTier: 'Hot'
  }
}

resource storageContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/${storageContainerName}'
  properties: {
    publicAccess: 'None'
  }
}

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: openAiName
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: openAiName
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
  }
}

resource docIntelAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: docIntelName
  location: location
  tags: tags
  kind: 'FormRecognizer'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: docIntelName
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
  }
}

resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    administrators: {
      administratorType: 'ActiveDirectory'
      principalType: 'User'
      login: principalName
      sid: principalId
      tenantId: subscription().tenantId
      azureADOnlyAuthentication: true
    }
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
}

resource sqlFirewallAzure 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  tags: union(tags, {
    'azd-service-name': webServiceName
  })
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      healthCheckPath: '/'
      appSettings: [
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'NEXT_PUBLIC_API_BASE_URL'
          value: 'https://${apiHostName}'
        }
      ]
    }
  }
}

resource apiApp 'Microsoft.Web/sites@2022-09-01' = {
  name: apiAppName
  location: location
  tags: union(tags, {
    'azd-service-name': apiServiceName
  })
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'PYTHON|3.11'
      alwaysOn: true
      healthCheckPath: '/health'
      appCommandLine: 'python -m uvicorn main:app --host 0.0.0.0 --port 8000'
      appSettings: [
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'ALLOWED_ORIGINS'
          value: 'https://${webHostName},http://localhost:3000,http://localhost:8000'
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: openAiAccount.properties.endpoint
        }
        {
          name: 'AZURE_OPENAI_API_KEY'
          value: openAiAccount.listKeys().key1
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT_NAME'
          value: 'gpt-4o'
        }
        {
          name: 'AZURE_DOC_INTEL_ENDPOINT'
          value: docIntelAccount.properties.endpoint
        }
        {
          name: 'AZURE_DOC_INTEL_KEY'
          value: docIntelAccount.listKeys().key1
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
        }
        {
          name: 'AZURE_STORAGE_CONTAINER'
          value: storageContainerName
        }
        {
          name: 'AZURE_SQL_SERVER'
          value: '${sqlServer.name}.${environment().suffixes.sqlServerHostname}'
        }
        {
          name: 'AZURE_SQL_DATABASE'
          value: sqlDatabase.name
        }
        {
          name: 'AZURE_ML_ENDPOINT'
          value: ''
        }
        {
          name: 'AZURE_ML_KEY'
          value: ''
        }
        {
          name: 'GOOGLE_CLIENT_ID'
          value: ''
        }
        {
          name: 'DEBUG'
          value: 'false'
        }
        {
          name: 'ALGORITHM'
          value: 'HS256'
        }
        {
          name: 'ACCESS_TOKEN_EXPIRE_MINUTES'
          value: '30'
        }
      ]
    }
  }
}

resource storageBlobDataContributorForApi 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, apiApp.id, 'Storage Blob Data Contributor')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
    )
    principalId: apiApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

output AZURE_LOCATION string = location
output SERVICE_WEB_NAME string = webApp.name
output SERVICE_API_NAME string = apiApp.name
output WEB_ENDPOINT string = 'https://${webApp.properties.defaultHostName}'
output API_ENDPOINT string = 'https://${apiApp.properties.defaultHostName}'
output SQL_SERVER string = sqlServer.name
output SQL_DATABASE string = sqlDatabase.name
output AZURE_STORAGE_ACCOUNT string = storageAccount.name
output AZURE_STORAGE_CONTAINER string = storageContainer.name
output AZURE_OPENAI_ENDPOINT string = openAiAccount.properties.endpoint
output AZURE_DOC_INTEL_ENDPOINT string = docIntelAccount.properties.endpoint
