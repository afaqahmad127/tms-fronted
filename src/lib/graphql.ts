import { gql } from '@apollo/client';

// Auth Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        fullName
        role
        department
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        fullName
        role
        department
      }
    }
  }
`;

// User Queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      fullName
      role
      department
      avatar
      isActive
    }
  }
`;

// Shipment Fragment
export const SHIPMENT_FRAGMENT = gql`
  fragment ShipmentFields on Shipment {
    id
    trackingNumber
    status
    priority
    type
    origin {
      street
      city
      state
      zipCode
      country
      contactName
      contactPhone
      contactEmail
    }
    destination {
      street
      city
      state
      zipCode
      country
      contactName
      contactPhone
      contactEmail
    }
    weight
    dimensions {
      length
      width
      height
    }
    description
    specialInstructions
    carrier
    estimatedDelivery
    actualDelivery
    cost
    insurance
    isFlagged
    flagReason
    assignedDriver
    vehicleId
    createdAt
    updatedAt
  }
`;

// Shipment Queries
export const GET_SHIPMENTS = gql`
  ${SHIPMENT_FRAGMENT}
  query GetShipments(
    $filter: ShipmentFilterInput
    $sort: ShipmentSortInput
    $page: Int
    $limit: Int
  ) {
    shipments(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      edges {
        node {
          ...ShipmentFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalPages
        currentPage
      }
      totalCount
    }
  }
`;

export const GET_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  query GetShipment($id: ID!) {
    shipment(id: $id) {
      ...ShipmentFields
      createdBy {
        id
        fullName
      }
      lastUpdatedBy {
        id
        fullName
      }
    }
  }
`;

export const GET_SHIPMENT_STATS = gql`
  query GetShipmentStats {
    shipmentStats {
      total
      pending
      inTransit
      delivered
      delayed
      cancelled
      flagged
      avgCost
      totalCost
    }
  }
`;

// Shipment Mutations
export const CREATE_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  mutation CreateShipment($input: CreateShipmentInput!) {
    createShipment(input: $input) {
      ...ShipmentFields
    }
  }
`;

export const UPDATE_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  mutation UpdateShipment($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      ...ShipmentFields
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id) {
      success
      message
      deletedId
    }
  }
`;

export const FLAG_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  mutation FlagShipment($id: ID!, $reason: String!) {
    flagShipment(id: $id, reason: $reason) {
      ...ShipmentFields
    }
  }
`;

export const UNFLAG_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  mutation UnflagShipment($id: ID!) {
    unflagShipment(id: $id) {
      ...ShipmentFields
    }
  }
`;

export const UPDATE_SHIPMENT_STATUS = gql`
  ${SHIPMENT_FRAGMENT}
  mutation UpdateShipmentStatus($id: ID!, $status: ShipmentStatus!) {
    updateShipmentStatus(id: $id, status: $status) {
      ...ShipmentFields
    }
  }
`;

