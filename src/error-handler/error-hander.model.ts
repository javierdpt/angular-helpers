/* eslint-disable id-blacklist */

/// <summary>403 Error codes definitions.</summary>
export enum ForbiddenErrorCodeEnum {
    /// <summary>Undefined 403 error.</summary>
    Undefined = 'Undefined',

    /// <summary>CommunityId para required.</summary>
    E0000001 = 'E0000001',
}

/// <summary>404 Error codes definitions.</summary>
export enum NotFoundErrorCodeEnum {
    /// <summary>Undefined 404 error.</summary>
    Undefined = 'Undefined',

    /// <summary>Edit lease resident doesn't bellong to the lease.</summary>
    E1000001 = 'E1000001',

    /// <summary>Lease not found.</summary>
    E1000002 = 'E1000002',

    /// <summary>Lease resident by link not found.</summary>
    E1000003 = 'E1000003',

    /// <summary>Lease details by link not found.</summary>
    E1000004 = 'E1000004',

    /// <summary>CommunityImage not found.</summary>
    E1000005 = 'E1000005',

    /// <summary>Link not found.</summary>
    E1000006 = 'E1000006',

    /// <summary>Interested party not found error.</summary>
    E1000007 = 'E1000007',

    /// <summary>Quote error not found error.</summary>
    E1000008 = 'E1000008',

    /// <summary>Issue error not found error.</summary>
    E1000009 = 'E1000009',

    /// <summary>Product items by leaseResidentId not found error.</summary>
    E1000010 = 'E1000010',

    /// <summary>OutsideInsurances by leaseResidentId not found error.</summary>
    E1000011 = 'E1000011',

    /// <summary>Resident link information on valid not found error.</summary>
    E1000012 = 'E1000012',

    /// <summary>OutsideInsurance by hash not found error.</summary>
    E1000013 = 'E1000013',

    /// <summary>OutsideInsurance validate documents not found error.</summary>
    E1000014 = 'E1000014',

    /// <summary>Update pol charges InsurancePolicy not found error.</summary>
    E1000015 = 'E1000015',

    /// <summary>Resident not found not found error.</summary>
    E1000016 = 'E1000016',

    /// <summary>Product Item not found.</summary>
    E1000017 = 'E1000017',

    /// <summary>Lease Resident for Move out not found.</summary>
    E1000018 = 'E1000018',

    /// <summary>Community - Notification not found.</summary>
    E1000019 = 'E1000019',

    /// <summary>Phone lookup not found.</summary>
    E1000020 = 'E1000020',

    /// <summary>Community integrated not found.</summary>
    E1000021 = 'E1000021',
}

/// <summary>400 Error codes definitons.</summary>
export enum BadRequestErrorCodeEnum {
    /// <summary>Undefined 404 error.</summary>
    Undefined = 'Undefined',

    /// <summary>Param required.</summary>
    E2000001 = 'E2000001',

    /// <summary>Issue policy.</summary>
    E2000002 = 'E2000002',

    /// <summary>Issue policy outsideInsurance content type incorrect.</summary>
    E2000003 = 'E2000003',

    /// <summary>Upload outsideInsurance invalid model.</summary>
    E2000004 = 'E2000004',

    /// <summary>Update POL charges invalid model.</summary>
    E2000005 = 'E2000005',

    /// <summary>Cancel POL policy invalid model.</summary>
    E2000006 = 'E2000006',

    /// <summary>Settings policy invalid model.</summary>
    E2000007 = 'E2000007',

    /// <summary>Settings invalid formats.</summary>
    E2000008 = 'E2000008',

    /// <summary>Lease not bellong the community.</summary>
    E2000009 = 'E2000009',

    /// <summary>Lease forms invalid model.</summary>
    E2000010 = 'E2000010',

    /// <summary>Model state invalid in validate resident by phone.</summary>
    E2000011 = 'E2000011',

    /// <summary>Product Item Id Bad Request </summary>
    E2000012 = 'E2000012',

    /// <summary>Cancel Policy Bad Request </summary>
    E2000013 = 'E2000013',

    /// <summary>Lease move out Bad Request </summary>
    E2000014 = 'E2000014',

    /// <summary>Lease renew Bad Request </summary>
    E2000015 = 'E2000015',

    /// <summary>Lease approve Bad Request </summary>
    E2000016 = 'E2000016',

    /// <summary>Lease locked.</summary>
    E2000017 = 'E2000017'
}

/// <summary>401 Error codes definitions.</summary>
export enum UnauthorizedErrorCodeEnum {
    /// <summary>Undefined 401 error.</summary>
    Undefined = 'Undefined',

    /// <summary>Issue policy with link not pending.</summary>
    E3000001 = 'E3000001',

    /// <summary>Model state invalid in validate OLutsideInsurance.</summary>
    E3000002 = 'E3000002',

    /// <summary>Lease locked.</summary>
    E3000003 = 'E3000003',
}
