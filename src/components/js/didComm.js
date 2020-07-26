module.exports = {
  invitationSetup(roomInvitationUrl) {
    let isMobile = true; //window.document.width() < 576;
    let urlParams = new URLSearchParams(roomInvitationUrl);
    //   let urlParams = new URLSearchParams(window.location.search);
    let d_m;
    let orig = 'https://link.streetcred.id/';
    console.log(orig);

    /****************************************************************************
    Check Parameters
  ****************************************************************************/
    if (urlParams.has('d_m')) {
      d_m = urlParams.get('d_m');
    } else if (urlParams.has('c_i')) {
      d_m = urlParams.get('c_i');
    } else {
      console.error('Missing d_m/c_i parameter');
      this.invitationError();
      return;
    }
    if (urlParams.has('orig')) {
      this.orig = urlParams.get('orig');
    } else {
      console.error('Missing orig parameter');
      this.invitationError();
      return;
    }

    /****************************************************************************
      Parse the DID Document
      ****************************************************************************/
    let didDoc = JSON.parse(atob(d_m));
    console.log(didDoc);
    let type = didDoc['@type'];

    /****************************************************************************
      If type is Connection Invitation
      ****************************************************************************/
    if (type.includes('invitation')) {
      //   document.getElementById('root').innerHTML = `
      //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">
      //     <div class="row justify-content-center">
      //       <div class="col-md-10 col-12">
      //         <h4>You're invited to connect.</h4>
      //         <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to connect with this organization.</p>
      //         <h6>Organization: ${didDoc.label}</h6>
      //       </div>
      //       <div class="col-md-2 col-6 text-centered">
      //         <img src=${didDoc.imageUrl} class="rounded" width="60%">
      //       </div>
      //     </div>
      //     <div class="row justify-content-center">
      //       <div class="col-7 text-centered w-50">
      //         <img id="qrcode" class="p-3">
      //       </div>
      //     </div>
      //     <div class="row justify-content-center">
      //       <div class="col text-centered">
      //         <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
      //       </div>
      //     </div>
      //   </div>
      // `;
    } else if (type.includes('request-presentation')) {
      /****************************************************************************
        If type is Connectionless Verification
        ****************************************************************************/
      let data = JSON.parse(
        atob(didDoc['request_presentations~attach'][0].data.base64)
      );
      let requestedAttrs = data.requested_attributes;
      let attrs = Object.keys(requestedAttrs);

      attrs.forEach(attr => {
        this.domAttrs += `<div class="normal-text attr">${attr}</div>`;
      });

      //   document.getElementById('root').innerHTML = `
      //   <div class="container">
      //     <h4>You've received a proof request from Trinsic.</h4>
      //     <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to complete it.</p>
      //   </div>
      //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">
      //     <div class="row justify-content-center">

      //       <div class="col-md-7 order-md-1 col-7 order-12">

      //         <div class="row justify-content-center">
      //           <div class="col text-centered">
      //             <img id="qrcode" class="p-3">
      //           </div>
      //         </div>

      //         <div class="row justify-content-center">
      //           <div class="col text-centered">
      //             <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
      //           </div>
      //         </div>

      //       </div>

      //       <div class="col-md-5 order-md-12 col-12 order-1">
      //       <a class="attr-dropdown ${
      //         isMobile ? '' : 'no-pointer'
      //       }" data-toggle="${
      //     isMobile ? 'collapse' : ''
      //   }" href="#attrs" role="button" aria-expanded="false" aria-controls="proof attributes">
      //         <h6>
      //           <span>
      //             <img id="chevron-down" src="./images/chevron-down.svg" style="display: none" >
      //             <img id="chevron-right" src="./images/chevron-right.svg" style="display: ${
      //               isMobile ? 'inline' : 'none'
      //             }" >
      //             Attributes to Prove
      //           </span>
      //         </h6>
      //       </a>
      //         <div class="collapse ${isMobile ? '' : 'show'}" id="attrs">
      //           ${domAttrs}
      //         </div>
      //       </div>

      //     </div>
      //   </div>
      // `;
      // $('#attrs').on('hide.bs.collapse', function() {
      //   let chevronDown = document.getElementById('chevron-down');
      //   let chevronRight = document.getElementById('chevron-right');

      //   chevronDown.style.display = 'none';
      //   chevronRight.style.display = 'inline';
      // });
      // $('#attrs').on('show.bs.collapse', function() {
      //   let chevronDown = document.getElementById('chevron-down');
      //   let chevronRight = document.getElementById('chevron-right');

      //   chevronDown.style.display = 'inline';
      //   chevronRight.style.display = 'none';
      // });
    } else if (type.includes('offer-credential')) {
      /****************************************************************************
        If type is Connectionless Credential Offer
        ****************************************************************************/
      let data = JSON.parse(atob(didDoc['offers~attach'][0].data.base64));
      let schemaId = data.schema_id;
      let credentialTitle = schemaId.substring(schemaId.indexOf(':') + 1);
      credentialTitle = credentialTitle.substring(
        credentialTitle.indexOf(':') + 1
      );
      credentialTitle = credentialTitle.substring(
        0,
        credentialTitle.indexOf(':')
      );
      console.log(credentialTitle);
      let previewAttrs = didDoc['credential_preview'].attributes;
      // let domAttrs = '';
      previewAttrs.forEach(attr => {
        this.domAttrs += `
          <div class="row normal-text">
            <div class="col left">
              <div class="attr">${attr.name}</div>
            </div>
            <div class="col right">
              <div class="attrv">${attr.value}</div>
            </div>
          </div>
        `;
      });

      //   document.getElementById('root').innerHTML = `
      //   <div class="container">
      //     <h4>You've received a credential offer.</h4>
      //     <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to accept it.</p>
      //   </div>
      //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">

      //     <div class="row justify-content-center no-gutters">
      //       <div class="col-md-6 order-md-1 mr-md-auto col-7 order-12">

      //         <div class="row justify-content-center">
      //           <div class="col text-centered">
      //             <img id="qrcode" class="p-3">
      //           </div>
      //         </div>

      //         <div class="row justify-content-center">
      //           <div class="col text-centered">
      //             <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
      //           </div>
      //         </div>

      //       </div>

      //       <div class="col-md-5 order-md-12 mr-md-5 pr-md-5 col-12 order-1">

      //           <div class="card credential-card d-none d-md-block mr-auto ml-auto">
      //             <div class="credential-banner"></div>
      //             <div class="card-body">
      //               <div class="row align-items-center">
      //                 <div class="col-4">
      //                   <div class="credential-logo">${credentialTitle.charAt(
      //                     0
      //                   )}</div>
      //                 </div>

      //                 <div class="col">
      //                   <h6>${credentialTitle}</h6>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>

      //           <div class="d-block d-md-none">
      //             <h6>${credentialTitle}</h6>
      //           </div>

      //           <a class="attr-dropdown ${
      //             isMobile ? '' : 'no-pointer'
      //           }" data-toggle="${
      //     isMobile ? 'collapse' : ''
      //   }" href="#attrs" role="button" aria-expanded="false" aria-controls="proof attributes">
      //             <h6>
      //               <span>
      //                 <img id="chevron-down" src="./images/chevron-down.svg" style="display: none" >
      //                 <img id="chevron-right" src="./images/chevron-right.svg" style="display: ${
      //                   isMobile ? 'inline' : 'none'
      //                 }" >
      //                 Attributes
      //               </span>
      //             </h6>
      //           </a>
      //           <div class="collapse ${isMobile ? '' : 'show'}" id="attrs">
      //             ${domAttrs}
      //           </div>

      //       </div>

      //     </div>
      //   </div>
      // `;
      // $('#attrs').on('hide.bs.collapse', function() {
      //   let chevronDown = document.getElementById('chevron-down');
      //   let chevronRight = document.getElementById('chevron-right');

      //   chevronDown.style.display = 'none';
      //   chevronRight.style.display = 'inline';
      // });
      // $('#attrs').on('show.bs.collapse', function() {
      //   let chevronDown = document.getElementById('chevron-down');
      //   let chevronRight = document.getElementById('chevron-right');

      //   chevronDown.style.display = 'inline';
      //   chevronRight.style.display = 'none';
      // });
    }

    /****************************************************************************
      QR Code and Wallet Link
      ****************************************************************************/
    if (isMobile === false) {
      // var qr = new QRious({
      // new QRious({
      //   element: document.getElementById('qrcode'),
      //   value: orig,
      //   size: 300,
      //   background: 'white',
      //   foreground: 'black'
      // });
    }

    // document.getElementById('wallet').addEventListener('click', function() {
    //   window.location.href = `id.streetcred://launch?c_i=${d_m}`;
    // });
  },
  invitationError() {
    alert('Uh Oh! There seems to be a problem with the invitation link...');
  }
};
