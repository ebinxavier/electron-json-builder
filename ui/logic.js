//   Example items
//   const items = [
//     {
//       componentName: "dcinventory",
//       select: "status",
//       from: "ilpn",
//       where: "ilpnId='$document.id'",
//       responseAttribute: "ilpnSearchOutput",
//       srcDest: "destination",
//     },
//   ];

const generateSourceDestinationJSON = (items) => {
  // TODO: Need to remove the following hardcoded values, take it from the from.
  const values = {
    prefix: "MA",
    clientCode: "UBTS",
    postFix: "SearchService",
    extensionNumber: "1234",
    messageType: "TEST_MSG",
    destinationHandlerName() {
      return `${this.prefix}${this.clientCode}${this.extensionNumber}${this.messageType}Handler`;
    },
    sourceHandlerName() {
      return `${this.prefix}${this.clientCode}${this.extensionNumber}${this.messageType}PreHandler`;
    },
    route: (index) => `Route${index}`,
    initialDestination: "awpf.noOp",
  };

  const makeDestination = (from) => {
    return `${values.prefix}${values.clientCode}${from}${values.postFix}`;
  };

  const makeDestinationId = (index) => {
    return `${values.destinationHandlerName()}${values.route(index)}`;
  };

  const makeSourceId = (index) => {
    return `${values.sourceHandlerName()}${values.route(index)}`;
  };

  const firstItem = {
    Condition: null,
    Destination: values.initialDestination,
    TransformationTemplate: null,
    TemplateContent: null,
    SourceId: "ON_EVENT",
    IsSync: true,
    IsDisabled: false,
    DestinationId: "",
    TransformationType: null,
    Source: "ON_EVENT",
    AugmentPayload: null,
    OutBoundMessageType: null,
    ExtensionhandlerRouteId: "",
    DestinationParams: [],
  };

  const sourceEntries = [
    {
      ...firstItem,
      DestinationId: makeSourceId(0),
      ExtensionhandlerRouteId: makeSourceId(0),
    },
  ];
  const destinationEntries = [
    {
      ...firstItem,
      DestinationId: makeDestinationId(0),
      ExtensionhandlerRouteId: makeDestinationId(0),
    },
  ];

  const queries = items.forEach((item) => {
    const TemplateContent = JSON.stringify({
      Query: item.where,
      Size: 1,
      Template: {
        [item.select]: null,
      },
    });

    let nextItem = {
      Condition: null,
      Destination: makeDestination(item.from),
      TransformationTemplate: "velocity.vm",
      TemplateContent,
      SourceId: "",
      IsSync: true,
      IsDisabled: false,
      DestinationId: "",
      TransformationType: "velocity",
      Source: "",
      AugmentPayload: item.responseAttribute,
      OutBoundMessageType: null,
      ExtensionhandlerRouteId: "",
      DestinationParams: [],
    };
    if (item.srcDest === "source") {
      sourceEntries.push({
        ...nextItem,
        Source: sourceEntries[sourceEntries.length - 1].Destination,
        SourceId: sourceEntries[sourceEntries.length - 1].DestinationId,
        DestinationId: makeSourceId(sourceEntries.length),
        ExtensionhandlerRouteId: makeSourceId(sourceEntries.length),
      });
    } else {
      destinationEntries.push({
        ...nextItem,
        Source: destinationEntries[destinationEntries.length - 1].Destination,
        SourceId:
          destinationEntries[destinationEntries.length - 1].DestinationId,
        DestinationId: makeDestinationId(destinationEntries.length),
        ExtensionhandlerRouteId: makeDestinationId(destinationEntries.length),
      });
    }
  });

  const sourceHandler = {
    Messages: null,
    RegisteredExtensionPoints: [],
    ExtensionhandlerRoute: sourceEntries,
    ExtensionHandlerId: values.sourceHandlerName(),
    ComponentId: "device-integration",
  };
  const destinationHandler = {
    Messages: null,
    RegisteredExtensionPoints: [],
    ExtensionhandlerRoute: destinationEntries,
    ExtensionHandlerId: values.destinationHandlerName(),
    ComponentId: "device-integration",
  };
  // console.log("Source\n_______\n", JSON.stringify(sourceHandler, null, 2));
  // console.log(
  //   "Destination\n_______\n",
  //   JSON.stringify(destinationHandler, null, 2)
  // );
  return { sourceHandler, destinationHandler };
};
