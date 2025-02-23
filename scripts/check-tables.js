require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

async function checkTables() {
  try {
    // Check if users table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      throw tablesError;
    }

    console.log('Existing tables:', tables.map(t => t.table_name));

    // Check users table structure if it exists
    if (tables.some(t => t.table_name === 'users')) {
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'users')
        .eq('table_schema', 'public');

      if (columnsError) {
        throw columnsError;
      }

      console.log('\nUsers table structure:');
      console.log(columns);

      // Check user_status enum if it exists
      const { data: enums, error: enumsError } = await supabase
        .from('pg_type')
        .select('typname')
        .eq('typname', 'user_status');

      if (enumsError) {
        throw enumsError;
      }

      console.log('\nEnum types:', enums);
    } else {
      console.log('\nUsers table does not exist');
    }
  } catch (error) {
    console.error('Error checking tables:', error.message);
    process.exit(1);
  }
}

checkTables(); 