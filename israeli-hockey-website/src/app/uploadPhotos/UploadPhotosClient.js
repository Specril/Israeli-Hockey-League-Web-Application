"use client";

import React, { useState } from 'react';
import { Layout, Upload, Button, Typography, message, Input, Card, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProtectedPage from "../ProtectedPage/ProtectedPage";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const uploadToDB = async (base64String) => {
  try {
    const response = await fetch('/api/form_manage_photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Photo: base64String }),
    });

    const result = await response.json();

    if (result.success) {
      message.success('התמונה הועלתה בהצלחה!');
      return result.Photo_ID; // Return the new Photo_ID from the server
    } else {
      message.error('שגיאה בהעלאת התמונה.');
      return null;
    }
  } catch (error) {
    message.error('שגיאה בהעלאת התמונה.');
    return null;
  }
};

const deletePhoto = async (photoId) => {
  try {
    const response = await fetch('/api/form_manage_photo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Photo_ID: photoId }),
    });

    const result = await response.json();

    if (result.success) {
      message.success('התמונה נמחקה בהצלחה!');
      return true;
    } else {
      message.error('שגיאה במחיקת התמונה.');
      return false;
    }
  } catch (error) {
    message.error('שגיאה במחיקת התמונה.');
    return false;
  }
};

export default function UploadPhotosClient({ initialPhotos }) {
  const [base64String, setBase64String] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleFileChange = ({ file }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result);
      setPhotoName(file.name); // Set default photo name to file name
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (base64String) {
      const newPhotoId = await uploadToDB(base64String);
      if (newPhotoId) {
        const newPhoto = {
          Photo_ID: newPhotoId,
          Photo: base64String
        };
        setPhotos([...photos, newPhoto]);
        setBase64String("");
        setPhotoName("");
      }
    } else {
      message.error('אנא העלה תמונה.');
    }
  };

  const handleDelete = async () => {
    if (selectedPhotoId) {
      const success = await deletePhoto(selectedPhotoId);
      if (success) {
        setPhotos(photos.filter(photo => photo.Photo_ID !== parseInt(selectedPhotoId)));
        setSelectedPhotoId(null);
        setSelectedPhoto(null);
      }
    } else {
      message.error('אנא בחר תמונה למחיקה.');
    }
  };

  const handlePhotoSelect = (value) => {
    setSelectedPhotoId(value);
    const photo = photos.find(p => p.Photo_ID === parseInt(value));
    setSelectedPhoto(photo);
  };

  return (
    <ProtectedPage content={
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ backgroundColor: '#001529' }}>
          <Typography.Title level={3} style={{ color: 'white', textAlign: 'center', margin: 0 }}>
            מערכת העלאת תמונות
          </Typography.Title>
        </Header>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Card style={{ width: '100%', maxWidth: '600px', textAlign: 'center', marginBottom: '20px' }}>
              <Typography.Title level={2}>העלאת תמונה</Typography.Title>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleFileChange({ file });
                  return false; // Prevent automatic upload
                }}
              >
                <Button icon={<UploadOutlined />}>בחר תמונה</Button>
              </Upload>
              {base64String && (
                <>
                  <Input
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                    placeholder="הזן שם לתמונה"
                    style={{ marginTop: '20px' }}
                  />
                  <Button type="primary" onClick={handleUpload} style={{ marginTop: '20px', width: '100%' }}>
                    שלח תמונה
                  </Button>
                  <div style={{ marginTop: '20px' }}>
                    <Typography.Title level={4}>תמונה שהועלתה:</Typography.Title>
                    <img src={base64String} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
                  </div>
                </>
              )}
            </Card>
            <Card style={{ width: '100%', maxWidth: '600px', textAlign: 'center', marginBottom: '20px' }}>
              <Typography.Title level={2}>בחירת תמונה למחיקה</Typography.Title>
              <Select
                style={{ width: '100%' }}
                placeholder="בחר תמונה"
                onChange={handlePhotoSelect}
                value={selectedPhotoId}
              >
                {photos.map(photo => (
                  <Option key={photo.Photo_ID} value={photo.Photo_ID.toString()}>
                    {`Photo ${photo.Photo_ID}`}
                  </Option>
                ))}
              </Select>
              {selectedPhoto && (
                <div style={{ marginTop: '20px' }}>
                  <img src={selectedPhoto.Photo} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
                  <Button type="primary" danger onClick={handleDelete} style={{ marginTop: '20px', width: '100%' }}>
                    מחק תמונה
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2023 מערכת העלאת תמונות</Footer>
      </Layout>
    }
      allowed_user_types={[]}
    />
  );
}
