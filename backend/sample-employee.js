// backend/sample-employees.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Employee schema (same as in your Employee model)
const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales']
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Terminated'],
    default: 'Active'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  }
}, {
  timestamps: true
});

// Generate employee ID automatically
employeeSchema.pre('save', async function(next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

// Sample employee data
const sampleEmployees = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1234567890',
    department: 'IT',
    position: 'Senior Developer',
    salary: 75000,
    hireDate: new Date('2022-01-15'),
    status: 'Active',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1234567891'
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1234567892',
    department: 'HR',
    position: 'HR Specialist',
    salary: 55000,
    hireDate: new Date('2021-03-20'),
    status: 'Active',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Mike Johnson',
      relationship: 'Brother',
      phone: '+1234567893'
    }
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '+1234567894',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 65000,
    hireDate: new Date('2020-11-10'),
    status: 'Active',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Lisa Brown',
      relationship: 'Wife',
      phone: '+1234567895'
    }
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1234567896',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 70000,
    hireDate: new Date('2019-08-05'),
    status: 'Active',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Robert Davis',
      relationship: 'Father',
      phone: '+1234567897'
    }
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1234567898',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 50000,
    hireDate: new Date('2023-02-14'),
    status: 'Active',
    address: {
      street: '654 Maple Ave',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Amy Wilson',
      relationship: 'Sister',
      phone: '+1234567899'
    }
  },
  {
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@company.com',
    phone: '+1234567800',
    department: 'Operations',
    position: 'Operations Coordinator',
    salary: 48000,
    hireDate: new Date('2021-12-01'),
    status: 'Active',
    address: {
      street: '987 Cedar Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Carlos Martinez',
      relationship: 'Husband',
      phone: '+1234567801'
    }
  },
  {
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@company.com',
    phone: '+1234567802',
    department: 'IT',
    position: 'System Administrator',
    salary: 68000,
    hireDate: new Date('2020-05-18'),
    status: 'Inactive',
    address: {
      street: '147 Birch St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Mary Taylor',
      relationship: 'Mother',
      phone: '+1234567803'
    }
  },
  {
    firstName: 'Amanda',
    lastName: 'Garcia',
    email: 'amanda.garcia@company.com',
    phone: '+1234567804',
    department: 'Marketing',
    position: 'Content Writer',
    salary: 45000,
    hireDate: new Date('2023-06-12'),
    status: 'Active',
    address: {
      street: '258 Willow Dr',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Luis Garcia',
      relationship: 'Father',
      phone: '+1234567805'
    }
  },
  {
    firstName: 'Kevin',
    lastName: 'Lee',
    email: 'kevin.lee@company.com',
    phone: '+1234567806',
    department: 'Finance',
    position: 'Accountant',
    salary: 52000,
    hireDate: new Date('2022-09-03'),
    status: 'Active',
    address: {
      street: '369 Spruce St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Sophie Lee',
      relationship: 'Wife',
      phone: '+1234567807'
    }
  },
  {
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@company.com',
    phone: '+1234567808',
    department: 'HR',
    position: 'HR Assistant',
    salary: 42000,
    hireDate: new Date('2023-04-18'),
    status: 'Active',
    address: {
      street: '741 Ash Lane',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Tom Anderson',
      relationship: 'Brother',
      phone: '+1234567809'
    }
  }
];

// Create sample employees
async function createSampleEmployees() {
  try {
    // Check if employees already exist
    const existingCount = await Employee.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing employees`);
      console.log('Deleting existing employees...');
      await Employee.deleteMany({});
      console.log('Deleted existing employees');
    }

    // Create new employees ONE BY ONE with manual employeeId generation
    console.log('Creating sample employees...');
    const createdEmployees = [];
    
    for (let i = 0; i < sampleEmployees.length; i++) {
      const employeeData = sampleEmployees[i];
      console.log(`Creating employee ${i + 1}/${sampleEmployees.length}: ${employeeData.firstName} ${employeeData.lastName}`);
      
      // Manually generate employeeId
      const employeeId = `EMP${String(i + 1).padStart(4, '0')}`;
      
      const employee = new Employee({
        ...employeeData,
        employeeId: employeeId
      });
      
      const savedEmployee = await employee.save();
      createdEmployees.push(savedEmployee);
      
      console.log(`✅ Created ${savedEmployee.employeeId}: ${savedEmployee.firstName} ${savedEmployee.lastName}`);
    }
    
    console.log(`\n🎉 Successfully created ${createdEmployees.length} sample employees:`);
    createdEmployees.forEach(emp => {
      console.log(`- ${emp.employeeId}: ${emp.firstName} ${emp.lastName} (${emp.department})`);
    });

    console.log('\n📊 Employee Statistics:');
    const stats = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} employees`);
    });

    console.log('\n📈 Status Breakdown:');
    const statusStats = await Employee.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    statusStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} employees`);
    });

    console.log('\n🎉 Sample data created successfully!');
    console.log('\n🚀 You can now test the application:');
    console.log('1. Login as Admin: admin@hrms.com / admin123');
    console.log('2. Login as HR: hr@hrms.com / hr123');
    console.log('3. Login as Employee: employee@hrms.com / employee123');
    console.log('\n📊 HR users can view dashboard and manage all employees');
    console.log('🔒 Admin users have full access including delete permissions');
    console.log('👤 Employee users can view basic dashboard information');
    
  } catch (error) {
    console.error('❌ Error creating sample employees:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    
    // Additional debugging
    if (error.name === 'ValidationError') {
      console.log('\n🔍 Debugging validation error:');
      console.log('Make sure your Employee model matches the schema in this script');
    }
  } finally {
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the function
createSampleEmployees();