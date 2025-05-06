import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  LocalShipping as ShippingIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import '../../styles/inventorySettings.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      className="settings-tabpanel"
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const InventorySettings: React.FC = () => {
  // State for sidebar
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for settings
  const [generalSettings, setGeneralSettings] = useState({
    lowStockThreshold: 20,
    criticalStockThreshold: 10,
    enableAutoReorder: false,
    defaultCategory: 'Uncategorized',
    enableStockAlerts: true,
    stockUpdateEmails: 'admin@example.com',
    inventoryCheckFrequency: 'weekly'
  });
  
  // State for category dialog
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
  // State for categories
  const [categories, setCategories] = useState([
    { id: 1, name: 'Chocolate', description: 'Chocolate products', productCount: 12 },
    { id: 2, name: 'Biscuit', description: 'Biscuit and cookie products', productCount: 8 },
    { id: 3, name: 'Candy', description: 'Candy and sweet products', productCount: 5 },
    { id: 4, name: 'Drinks', description: 'Beverage products', productCount: 7 }
  ]);
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    lowStockNotifications: true,
    orderNotifications: true,
    priceChangeNotifications: false,
    expiryDateNotifications: true,
    emailNotifications: true,
    pushNotifications: false
  });
  
  // State for loading
  const [saving, setSaving] = useState(false);

  // Sidebar toggle handler
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle general settings change
  const handleGeneralSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle select change
  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof generalSettings;
    setGeneralSettings({
      ...generalSettings,
      [name]: event.target.value
    });
  };
  
  // Handle notification settings change
  const handleNotificationSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  // Handle category dialog open
  const handleOpenCategoryDialog = () => {
    setNewCategory({ name: '', description: '' });
    setOpenCategoryDialog(true);
  };
  
  // Handle category dialog close
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };
  
  // Handle new category input change
  const handleCategoryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };
  
  // Handle add category
  const handleAddCategory = () => {
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    const newCategoryItem = {
      id: newId,
      name: newCategory.name,
      description: newCategory.description,
      productCount: 0
    };
    setCategories([...categories, newCategoryItem]);
    setOpenCategoryDialog(false);
  };
  
  // Handle delete category
  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <main className="main-container">
        <div className="inventory-settings">
          {/* Settings Header */}
          <Box className="settings-header">
            <Typography variant="h4" className="settings-title">
              Inventory Settings
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              className="save-button"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Settings'}
            </Button>
          </Box>
          
          {/* Settings Tabs */}
          <Paper className="settings-container">
            <Box className="settings-tabs-container">
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                orientation="vertical"
                className="settings-tabs"
              >
                <Tab 
                  label="General" 
                  icon={<SettingsIcon />} 
                  className="settings-tab"
                />
                <Tab 
                  label="Categories" 
                  icon={<CategoryIcon />} 
                  className="settings-tab"
                />
                <Tab 
                  label="Notifications" 
                  icon={<NotificationsIcon />} 
                  className="settings-tab"
                />
                <Tab 
                  label="Warehouses" 
                  icon={<StorageIcon />} 
                  className="settings-tab"
                />
                <Tab 
                  label="Suppliers" 
                  icon={<ShippingIcon />} 
                  className="settings-tab"
                />
              </Tabs>
              
              <Box className="settings-content">
                <TabPanel value={tabValue} index={0}>
                  <Typography variant="h5" className="settings-section-title">
                    General Settings
                  </Typography>
                  <Typography variant="body2" className="settings-section-description">
                    Configure general inventory settings and thresholds.
                  </Typography>
                  
                  <Grid container spacing={3} className="settings-form">
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Low Stock Threshold"
                        name="lowStockThreshold"
                        type="number"
                        value={generalSettings.lowStockThreshold}
                        onChange={handleGeneralSettingsChange}
                        variant="outlined"
                        className="settings-input"
                        helperText="Products below this quantity will be marked as low stock"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Critical Stock Threshold"
                        name="criticalStockThreshold"
                        type="number"
                        value={generalSettings.criticalStockThreshold}
                        onChange={handleGeneralSettingsChange}
                        variant="outlined"
                        className="settings-input"
                        helperText="Products below this quantity will be marked as critical stock"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined" className="settings-input">
                        <InputLabel>Default Category</InputLabel>
                        <Select
                          name="defaultCategory"
                          value={generalSettings.defaultCategory}
                          onChange={handleSelectChange}
                          label="Default Category"
                        >
                          <MenuItem value="Uncategorized">Uncategorized</MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined" className="settings-input">
                        <InputLabel>Inventory Check Frequency</InputLabel>
                        <Select
                          name="inventoryCheckFrequency"
                          value={generalSettings.inventoryCheckFrequency}
                          onChange={handleSelectChange}
                          label="Inventory Check Frequency"
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="biweekly">Bi-weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Stock Update Email Recipients"
                        name="stockUpdateEmails"
                        value={generalSettings.stockUpdateEmails}
                        onChange={handleGeneralSettingsChange}
                        variant="outlined"
                        className="settings-input"
                        helperText="Comma-separated email addresses for stock update notifications"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={generalSettings.enableStockAlerts}
                            onChange={handleGeneralSettingsChange}
                            name="enableStockAlerts"
                            color="primary"
                          />
                        }
                        label="Enable Stock Alerts"
                        className="settings-switch"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={generalSettings.enableAutoReorder}
                            onChange={handleGeneralSettingsChange}
                            name="enableAutoReorder"
                            color="primary"
                          />
                        }
                        label="Enable Auto Reorder"
                        className="settings-switch"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  <Box className="categories-header">
                    <Typography variant="h5" className="settings-section-title">
                      Categories
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      className="add-button"
                      onClick={handleOpenCategoryDialog}
                    >
                      Add Category
                    </Button>
                  </Box>
                  <Typography variant="body2" className="settings-section-description">
                    Manage product categories for better organization.
                  </Typography>
                  
                  <List className="categories-list">
                    {categories.map((category) => (
                      <Paper key={category.id} className="category-item">
                        <ListItem>
                          <ListItemIcon>
                            <CategoryIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={category.name} 
                            secondary={category.description} 
                          />
                          <Chip 
                            label={`${category.productCount} products`} 
                            size="small" 
                            className="category-count"
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" className="edit-button">
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              className="delete-button"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  <Typography variant="h5" className="settings-section-title">
                    Notification Settings
                  </Typography>
                  <Typography variant="body2" className="settings-section-description">
                    Configure when and how you receive inventory notifications.
                  </Typography>
                  
                  <Box className="notification-settings">
                    <Typography variant="h6" className="settings-subsection-title">
                      Notification Types
                    </Typography>
                    <Paper className="settings-paper">
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon className="notification-icon warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Low Stock Alerts" 
                            secondary="Get notified when products fall below the low stock threshold" 
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={notificationSettings.lowStockNotifications}
                              onChange={handleNotificationSettingsChange}
                              name="lowStockNotifications"
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemIcon>
                            <ShippingIcon className="notification-icon order" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Order Notifications" 
                            secondary="Get notified when new orders are placed" 
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={notificationSettings.orderNotifications}
                              onChange={handleNotificationSettingsChange}
                              name="orderNotifications"
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemIcon>
                            <InventoryIcon className="notification-icon price" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Price Change Alerts" 
                            secondary="Get notified when product prices are updated" 
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={notificationSettings.priceChangeNotifications}
                              onChange={handleNotificationSettingsChange}
                              name="priceChangeNotifications"
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon className="notification-icon expiry" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Expiry Date Alerts" 
                            secondary="Get notified when products are approaching expiry dates" 
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={notificationSettings.expiryDateNotifications}
                              onChange={handleNotificationSettingsChange}
                              name="expiryDateNotifications"
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </Paper>
                    
                    <Typography variant="h6" className="settings-subsection-title" sx={{ mt: 4 }}>
                      Notification Channels
                    </Typography>
                    <Paper className="settings-paper">
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon className="notification-icon email" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Email Notifications" 
                            secondary="Receive notifications via email" 
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={notificationSettings.emailNotifications}
                              onChange={handleNotificationSettingsChange}
                              name="emailNotifications"
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemIcon>
                            <NotificationsIcon className="notification-icon push" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Push Notifications" 
                            secondary="Receive notifications in your browser" 
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={notificationSettings.pushNotifications}
                              onChange={handleNotificationSettingsChange}
                              name="pushNotifications"
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </Paper>
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={3}>
                  <Typography variant="h5" className="settings-section-title">
                    Warehouse Settings
                  </Typography>
                  <Typography variant="body2" className="settings-section-description">
                    Manage warehouse locations and settings.
                  </Typography>
                  
                  <Box className="placeholder-content">
                    <StorageIcon className="placeholder-icon" />
                    <Typography variant="h6">
                      Warehouse management coming soon
                    </Typography>
                    <Typography variant="body2">
                      This feature is currently under development. Check back later for updates.
                    </Typography>
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={4}>
                  <Typography variant="h5" className="settings-section-title">
                    Supplier Settings
                  </Typography>
                  <Typography variant="body2" className="settings-section-description">
                    Manage supplier information and preferences.
                  </Typography>
                  
                  <Box className="placeholder-content">
                    <ShippingIcon className="placeholder-icon" />
                    <Typography variant="h6">
                      Supplier management coming soon
                    </Typography>
                    <Typography variant="body2">
                      This feature is currently under development. Check back later for updates.
                    </Typography>
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Paper>
          
          {/* Add Category Dialog */}
          <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
              <Box className="dialog-form">
                <TextField
                  fullWidth
                  label="Category Name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleCategoryInputChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCategoryDialog} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleAddCategory} 
                color="primary" 
                variant="contained"
                disabled={!newCategory.name}
              >
                Add Category
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default InventorySettings;