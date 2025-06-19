export const getStatusColor = (status: string) => {
  switch (status) {
    case 'created': return 'bg-blue-100 text-blue-800';
    case 'in-progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'created': return 'Ready';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return status;
  }
}; 