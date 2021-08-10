import React, { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, Redirect } from "react-router-dom";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Layout,
    Radio,
    Typography,
    Upload,
} from "antd";

import { UploadChangeParam } from "antd/lib/upload";

import { HOST_LISTING } from "../../lib/graphql/mutations";
import {
    HostListing as HostListingData,
    HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";

import { Viewer } from "../../lib/types";
import { ListingType } from "../../lib/graphql/globalTypes";
import {
    iconColor,
    displayErrorMessage,
    displaySuccessNotification,
} from "../../lib/utils";

import {
    HomeOutlined,
    BankOutlined,
    LoadingOutlined,
    PlusOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
    viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageBase64Value, setImageBase64Value] = useState<string | null>(
        null
    );

    const [hostListing, { loading, data }] = useMutation<
        HostListingData,
        HostListingVariables
    >(HOST_LISTING, {
        onError: () => {
            displayErrorMessage(
                "Sorry! We weren't able to create your listing. Please try again later!"
            );
        },
        onCompleted: () => {
            displaySuccessNotification(
                "You've successfully created your listing!"
            );
        },
    });

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);

        const fullAddress = `${values.address}, ${values.city}, ${values.postalCode}`;

        const input = {
            ...values,
            address: fullAddress,
            image: imageBase64Value,
            price: values.price * 100,
        };

        delete input.city;
        delete input.state;
        delete input.postalCode;

        hostListing({
            variables: {
                input,
            },
        });
    };

    const handleImageUpload = (info: UploadChangeParam) => {
        const { file } = info;
        console.log(file);
        //console.log(file.status);

        if (file.status === "uploading") {
            setImageLoading(true);
            return;
        }

        if (file.status === "done" && file.originFileObj) {
            getBase64Value(file.originFileObj, (imageBase64Value) => {
                setImageBase64Value(imageBase64Value);
                setImageLoading(false);
            });
        }
    };

    if (!viewer.id || !viewer.hasWallet) {
        return (
            <Content className="host-content">
                <div className="host__form-header">
                    <Title level={4} className="host__form-title">
                        You'll have to be signed in and connected with Stripe to
                        host a listing!
                    </Title>
                    <Text type="secondary">
                        We only allow users who've signed in to our app and have
                        connected with Stripe to host new listings. You can sign
                        in at the <Link to="/login">login</Link> page and
                        connect with Stripe shortly after.
                    </Text>
                </div>
            </Content>
        );
    }

    if (loading) {
        return (
            <Content className="host-content">
                <div className="host__form-header">
                    <Title level={4} className="host__form-title">
                        Please wait!
                    </Title>
                    <Text type="secondary">
                        We're creating your listing now
                    </Text>
                </div>
            </Content>
        );
    }

    /*  if (data && data.hostListing) {
        return <Redirect to={`/listing/${data.hostListing.id}`} />;
    } */
    const dummyRequest = ({ file, onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <Content className="host-content">
            <Form layout="vertical" onFinish={onFinish}>
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Hi! Let's get started listing your place.
                    </Title>
                    <Text type="secondary">
                        In this form, we'll collect some basic additional
                        information about your listing.
                    </Text>
                </div>

                <Item
                    name="type"
                    label="Home Type"
                    rules={[
                        {
                            required: true,
                            message: "Please select a home type!",
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio.Button value={ListingType.APARTMENT}>
                            <BankOutlined style={{ color: iconColor }} />{" "}
                            <span>Apartment</span>
                        </Radio.Button>
                        <Radio.Button value={ListingType.HOUSE}>
                            <HomeOutlined style={{ color: iconColor }} />{" "}
                            <span>House</span>
                        </Radio.Button>
                    </Radio.Group>
                </Item>

                <Item
                    name="numOfGuests"
                    label="Max # of Guests"
                    rules={[
                        {
                            required: true,
                            message: "Please emter a max number of guests!",
                        },
                    ]}
                >
                    <InputNumber min={1} placeholder="4" />
                </Item>

                <Item
                    name="title"
                    label="Title"
                    extra="Max character count of 45"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a title for your Listing!",
                        },
                    ]}
                >
                    <Input
                        maxLength={45}
                        placeholder="The iconic and luxurious Bel-Air mansion"
                    />
                </Item>
                <Item
                    name="description"
                    label="Description of listing"
                    extra="Max character count of 400"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter a discription for your Listing!",
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={3}
                        maxLength={400}
                        placeholder="Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air Los Angeles"
                    />
                </Item>
                <Item
                    name="address"
                    label="Address"
                    rules={[
                        {
                            required: true,
                            message: "This field cannot be empty!",
                        },
                    ]}
                >
                    <Input placeholder="251 North Bristol Avenue" />
                </Item>
                <Item
                    name="city"
                    label="City/Town"
                    rules={[
                        {
                            required: true,
                            message: "This field cannot be empty!",
                        },
                    ]}
                >
                    <Input placeholder="Los Angeles" />
                </Item>
                <Item
                    name="state"
                    label="State/Province"
                    rules={[
                        {
                            required: true,
                            message: "This field cannot be empty!",
                        },
                    ]}
                >
                    <Input placeholder="California" />
                </Item>
                <Item
                    name="postalCode"
                    label="Zip/Postal Code"
                    rules={[
                        {
                            required: true,
                            message: "This field cannot be empty!",
                        },
                    ]}
                >
                    <Input placeholder="Please enter a zip code for your listing!" />
                </Item>

                <Item
                    name="image"
                    label="Image"
                    extra="Image have to be under 1MB in size and of type JPG or PNG"
                >
                    <div className="host__form-image-upload">
                        <Upload
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            /* action="https://run.mocky.io/v3/4251cdd0-f9f8-4d1f-8f65-1e99ec740b7d" */
                            //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            customRequest={dummyRequest}
                            beforeUpload={beforeImageUpload}
                            onChange={handleImageUpload}
                        >
                            {imageBase64Value ? (
                                <img src={imageBase64Value} alt="Listing" />
                            ) : (
                                <div>
                                    {imageLoading ? (
                                        <LoadingOutlined />
                                    ) : (
                                        <PlusOutlined />
                                    )}
                                    <div className="ant-upload-text">
                                        Upload
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </div>
                </Item>

                <Item
                    name="price"
                    label="Price"
                    extra="All prices in $USD/day"
                    rules={[
                        {
                            required: true,
                            message: "This field cannot be empty!",
                        },
                    ]}
                >
                    <InputNumber min={0} placeholder="120" />
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Item>
            </Form>
        </Content>
    );
};

const beforeImageUpload = (file: File) => {
    const fileIsValidImage =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg";
    const fileIsValidSize = file.size / 1024 / 1024 < 1;

    console.log(file.type);

    if (!fileIsValidImage) {
        displayErrorMessage(
            "You're only able to upload valid JPG or PNG files!"
        );
        return false;
    }

    if (!fileIsValidSize) {
        displayErrorMessage(
            "You're only able to upload valid image files of under 1MB in size!"
        );
        return false;
    }

    return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
    img: File | Blob,
    callback: (imageBase64Value: string) => void
) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
        callback(reader.result as string);
    };
};
