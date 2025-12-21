/**
 * Intelligent Database Query Parser for HR Chatbot
 * Parses natural language requests and executes secure database queries
 */

const {
  countDocuments,
  findDocuments,
  getCollectionStats,
  getCollectionSummary,
} = require('./secureDbQuery');

/**
 * Parse HR user's natural language query and execute it
 * @param {string} userMessage - User's question/request
 * @returns {Promise<Object>} Query result or null if not a database query
 */
async function executeHRDatabaseQuery(userMessage) {
  try {
    const message = userMessage.toLowerCase();

    // Keywords to identify database queries
    const countKeywords = ['how many', 'count', 'total', 'number of'];
    const findKeywords = ['show', 'find', 'get', 'list', 'view', 'retrieve'];
    const statsKeywords = ['statistics', 'stats', 'breakdown', 'summary', 'analyze'];
    const schemaKeywords = ['fields', 'columns', 'available', 'what can i', 'schema'];
    
    // Status keywords that indicate implicit find queries
    const implicitQueryKeywords = [
      'active', 'inactive', 'accepted', 'rejected', 'pending', 'under review',
      'in progress', 'completed', 'interview', 'engineering', 'sales', 'hr', 'marketing'
    ];

    // Check if message contains database query keywords
    const isCountQuery = countKeywords.some(kw => message.includes(kw));
    const isFindQuery = findKeywords.some(kw => message.includes(kw));
    const isStatsQuery = statsKeywords.some(kw => message.includes(kw));
    const isSchemaQuery = schemaKeywords.some(kw => message.includes(kw));
    
    // Check for implicit queries (e.g., "active employee", "rejected candidate")
    const isImplicitQuery = implicitQueryKeywords.some(kw => message.includes(kw)) && 
                           (message.includes('candidate') || message.includes('employee') || 
                            message.includes('user') || message.includes('onboarding'));

    // If no database query keywords, return null
    if (!isCountQuery && !isFindQuery && !isStatsQuery && !isSchemaQuery && !isImplicitQuery) {
      return null;
    }

    // Schema query - return available collections
    if (isSchemaQuery) {
      const schema = await getCollectionSummary();
      return {
        type: 'schema',
        result: schema,
        message: 'Here are the available collections and fields:',
      };
    }

    // Extract collection name from message
    const collection = parseCollectionName(message);
    if (!collection) {
      return null; // Couldn't identify collection
    }

    // Stats query
    if (isStatsQuery) {
      const result = await getCollectionStats(collection);
      return {
        type: 'stats',
        collection: collection,
        result: result.statistics,
        message: `Here are the statistics for ${collection}:`,
      };
    }

    // Parse filters from message
    const filters = parseFilters(message, collection);

    // Count query
    if (isCountQuery) {
      const result = await countDocuments(collection, filters);
      return {
        type: 'count',
        collection: collection,
        count: result.count,
        filters: filters,
        message: `Found ${result.count} ${collection.toLowerCase()}${result.count !== 1 ? 's' : ''}${Object.keys(filters).length > 0 ? ' matching your criteria' : ''}.`,
      };
    }

    // Find query (default if find keywords present)
    if (isFindQuery) {
      const result = await findDocuments(collection, filters, { limit: 10 });
      return {
        type: 'find',
        collection: collection,
        count: result.count,
        data: result.data,
        filters: filters,
        message: `Found ${result.count} ${collection.toLowerCase()}${result.count !== 1 ? 's' : ''} matching your criteria.`,
      };
    }

    return null;
  } catch (error) {
    console.error('Database Query Error:', error.message);
    return {
      type: 'error',
      error: error.message,
    };
  }
}

/**
 * Parse collection name from user message
 * @param {string} message - User message (lowercase)
 * @returns {string|null} Collection name or null
 */
function parseCollectionName(message) {
  const collectionAliases = {
    'Candidates': ['candidate', 'candidates', 'applicants', 'applicant'],
    'Employees': ['employee', 'employees', 'staff', 'team members'],
    'OnboardingSubmissions': ['onboarding', 'onboarding submissions', 'new joiner', 'new joiners'],
    'Users': ['users', 'accounts', 'user accounts'],
  };

  for (const [collection, aliases] of Object.entries(collectionAliases)) {
    for (const alias of aliases) {
      if (message.includes(alias)) {
        return collection;
      }
    }
  }

  return null;
}

/**
 * Parse filter criteria from user message
 * @param {string} message - User message (lowercase)
 * @param {string} collection - Collection name
 * @returns {Object} Filters object
 */
function parseFilters(message, collection) {
  const filters = {};

  // Status mappings for Candidates collection (uses offerStatus field)
  const candidateStatusMappings = {
    'accepted': 'ACCEPTED',
    'accepted offer': 'ACCEPTED',
    'accepted offers': 'ACCEPTED',
    'offer accepted': 'ACCEPTED',
    'rejected': 'REJECTED',
    'pending': 'PENDING',
    'under review': 'UNDER_REVIEW',
    'interview': 'INTERVIEW',
  };

  // Status mappings for other collections
  const generalStatusMappings = {
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'pending': 'Pending',
    'under review': 'Under Review',
    'in progress': 'In Progress',
    'completed': 'Completed',
    'active': 'Active',
    'inactive': 'Inactive',
  };

  // For Candidates, check offerStatus with specific mappings
  if (collection === 'Candidates') {
    for (const [term, statusValue] of Object.entries(candidateStatusMappings)) {
      if (message.includes(term)) {
        filters.offerStatus = statusValue;
        break;
      }
    }
  } else {
    // For other collections, use status field
    for (const [term, statusValue] of Object.entries(generalStatusMappings)) {
      if (message.includes(term)) {
        filters.status = statusValue;
        break;
      }
    }
  }

  // Department mappings
  const departmentMappings = {
    'engineering': 'Engineering',
    'engineer': 'Engineering',
    'hr': 'HR',
    'human resources': 'HR',
    'sales': 'Sales',
    'marketing': 'Marketing',
    'finance': 'Finance',
    'operations': 'Operations',
  };

  // Check for department values (for Employees collection)
  if (collection === 'Employees') {
    for (const [term, deptValue] of Object.entries(departmentMappings)) {
      if (message.includes(term)) {
        filters.department = deptValue;
        break;
      }
    }
  }

  return filters;
}

/**
 * Format database query result for chatbot response
 * @param {Object} queryResult - Result from executeHRDatabaseQuery
 * @returns {string} Formatted response
 */
function formatQueryResult(queryResult) {
  if (!queryResult) {
    return null;
  }

  if (queryResult.type === 'error') {
    return `I encountered an error: ${queryResult.error}. Please try rephrasing your request.`;
  }

  let response = '';

  if (queryResult.type === 'count') {
    // Simple, friendly count response
    if (queryResult.count === 0) {
      response = `No ${queryResult.collection.toLowerCase()} found matching your criteria.`;
    } else if (queryResult.count === 1) {
      response = `Found **1** ${queryResult.collection.toLowerCase().slice(0, -1)}.`;
    } else {
      response = `Found **${queryResult.count}** ${queryResult.collection.toLowerCase()}.`;
    }
  }

  if (queryResult.type === 'find' && queryResult.data && queryResult.data.length > 0) {
    if (queryResult.count === 1) {
      response = `Found **1** ${queryResult.collection.toLowerCase().slice(0, -1)}:\n`;
    } else {
      response = `Found **${queryResult.count}** ${queryResult.collection.toLowerCase()}:\n`;
    }
    
    queryResult.data.forEach((item, index) => {
      response += `\n${index + 1}. `;
      
      // Build display string based on available fields
      const parts = [];
      
      // Name fields
      if (item.name) parts.push(`**${item.name}**`);
      if (item.firstName && item.lastName) parts.push(`**${item.firstName} ${item.lastName}**`);
      if (item.candidateName) parts.push(`**${item.candidateName}**`);
      
      // Email
      if (item.email) parts.push(item.email);
      
      // Position/Role
      if (item.position) parts.push(item.position);
      
      // Department
      if (item.department) parts.push(item.department);
      
      // Status
      if (item.offerStatus) parts.push(`Offer: ${item.offerStatus}`);
      if (item.status && !item.offerStatus) parts.push(`Status: ${item.status}`);
      
      response += parts.join(' | ');
    });
  }

  if (queryResult.type === 'stats') {
    response = `**${queryResult.collection} Statistics**\n`;
    
    if (queryResult.result.total) {
      response += `\nTotal: **${queryResult.result.total}**\n`;
    }
    
    if (queryResult.result.byStatus && queryResult.result.byStatus.length > 0) {
      response += '\n**By Status:**\n';
      queryResult.result.byStatus.forEach(stat => {
        response += `  • ${stat._id}: ${stat.count}\n`;
      });
    }
    
    if (queryResult.result.byDepartment && queryResult.result.byDepartment.length > 0) {
      response += '\n**By Department:**\n';
      queryResult.result.byDepartment.forEach(stat => {
        response += `  • ${stat._id}: ${stat.count}\n`;
      });
    }
  }

  if (queryResult.type === 'schema') {
    response = '**Available Collections**\n';
    for (const [name, info] of Object.entries(queryResult.result)) {
      response += `\n📁 **${name}**\n`;
      response += `   ${info.description}\n`;
      response += `   Fields: ${info.availableFields.slice(0, 5).join(', ')}...`;
    }
  }

  return response;
}

module.exports = {
  executeHRDatabaseQuery,
  formatQueryResult,
  parseCollectionName,
  parseFilters,
};
